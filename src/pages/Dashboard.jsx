import { Container, Box } from "@mui/material";
import DashboardTable from "../components/DashboardTable";
import ReportsTable from "../components/FormReport/DashboardTable";

const Dashboard = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <DashboardTable />
      <Box mt={6} />
      <ReportsTable />
    </Container>
  );
};

export default Dashboard;
