import SideNavigation from "../components/SideNavigation";
import Header from "../components/Header";
import GraphCustomer from "../components/GraphCustomer";
import CustomerTable from "../components/CustomerTable";

import styles from "./Dashboard.module.css";

const Dashboard = () => {


  return (
    <div className={styles.dashboard}>
      <Header />
      <SideNavigation />
      <GraphCustomer />
      <CustomerTable />
    </div>
  );
};

export default Dashboard;
