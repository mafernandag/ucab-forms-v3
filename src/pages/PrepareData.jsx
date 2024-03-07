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

const Report = () => {
  const { form, loading: loadingForm } = useForm();
  const [openDrawer, setOpenDrawer] = useState(false);
  const { loading: loadingReport, setReportTitle, reportTitle } = useReport();

  if (loadingForm || loadingReport) {
    return (
      <Box>
        <Header />
        <LinearProgress />
      </Box>
    );
  }

  const handleReportTitle = (title) => {
    setReportTitle(title);
  };

  return (
    <CustomThemeProvider form={form}>
      <Box>
        <Header setOpenDrawer={setOpenDrawer} />
        {loadingReport && <LinearProgress sx={{ zIndex: 9999 }} />}
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
    </CustomThemeProvider>
  );
};

export default Report;
