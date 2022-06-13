import { useMemo, useState } from "react";
import { Box, LinearProgress, Stack, TextField } from "@mui/material";
import { debounce } from "lodash";
import { saveForm } from "../api/forms";
import { useUser } from "../hooks/useUser";
import { useForm } from "../hooks/useForm";
import Header from "../components/Header";
import Card from "../components/Card";
import EditFormHeader from "../components/EditForm/Header";
import DrawerLayout from "../components/EditForm/DrawerLayout";
import Tabs from "../components/EditForm/Tabs";
import AnswerPageText from "../components/AnswerPageText";

const EditForm = () => {
  const user = useUser();
  const { form, setForm, loading } = useForm();
  const [openDrawer, setOpenDrawer] = useState(false);

  const debouncedSave = useMemo(() => {
    return debounce((form) => {
      saveForm(form);
    }, 1500);
  }, []);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    const newForm = { ...form, [field]: value };

    debouncedSave(newForm);
    setForm(newForm);
  };

  if (loading) {
    return (
      <Box>
        <Header />
        <LinearProgress />
      </Box>
    );
  }

  if (!form) {
    return <AnswerPageText>No se encontró la encuesta</AnswerPageText>;
  }

  if (
    form.author.id !== user.id &&
    !form.collaborators.find((c) => c.email === user.email)
  ) {
    return (
      <AnswerPageText>
        No tienes permisos para editar esta encuesta
      </AnswerPageText>
    );
  }

  return (
    <Box>
      <EditFormHeader setOpenDrawer={setOpenDrawer} />
      <DrawerLayout open={openDrawer} setOpen={setOpenDrawer}>
        <Stack spacing={2}>
          <Card>
            <Stack spacing={2}>
              <TextField
                variant="standard"
                multiline
                label="Título"
                value={form.title}
                onChange={handleChange("title")}
              />
              <TextField
                variant="standard"
                multiline
                label="Descripción"
                value={form.description}
                onChange={handleChange("description")}
              />
            </Stack>
          </Card>
          <Tabs setOpenDrawer={setOpenDrawer} />
        </Stack>
      </DrawerLayout>
    </Box>
  );
};

export default EditForm;
