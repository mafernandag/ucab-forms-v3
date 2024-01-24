import { Container, Box } from "@mui/material";
import DashboardTable from "../components/DashboardTable";
import Table from "../components/Table";
const Dashboard = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <DashboardTable />
      <Box mt={6} />
      <Table title="Mis Reportes" />
    </Container>
  );
};

export default Dashboard;
