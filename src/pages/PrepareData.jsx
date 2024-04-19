import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Stack,
  Card,
  TextField,
  Button,
  Typography,
  LinearProgress,
} from "@mui/material";
import { useForm } from "../hooks/useForm";
import Header from "../components/FormReport/Header";
import DrawerLayout from "../components/FormReport/DrawerLayout";
import CustomThemeProvider from "../components/CustomThemeProvider";
import DataTable from "../components/FormReport/Tables/DataTable";
import { useReport } from "../hooks/useReport";
import AnswerPageText from "../components/AnswerPageText";
import { useUser } from "../hooks/useUser";

const PrepareData = () => {
  const user = useUser();
  const { form, loading: loadingForm } = useForm();
  const [openDrawer, setOpenDrawer] = useState(true);
  const { loading: loadingReport, setReportTitle, reportTitle } = useReport();

  if (loadingForm || loadingReport) {
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
        No tienes permisos para crear un reporte con esta encuesta
      </AnswerPageText>
    );
  }

  const handleReportTitle = (title) => {
    setReportTitle(title);
  };

  return (
    <Box>
      <Header setOpenDrawer={setOpenDrawer} />
      {/* {loadingReport && <LinearProgress sx={{ zIndex: 9999 }} />} */}
      <DrawerLayout open={openDrawer} setOpen={setOpenDrawer}>
        <Stack spacing={3}>
          <Card sx={{ padding: "20px" }}>
            <TextField
              label="Título del reporte"
              defaultValue={reportTitle}
              onChange={(e) => handleReportTitle(e.target.value)}
              variant="standard"
              fullWidth
            />
          </Card>
          <Card>
            <DataTable />
          </Card>
        </Stack>
      </DrawerLayout>
    </Box>
  );
};

export default PrepareData;
