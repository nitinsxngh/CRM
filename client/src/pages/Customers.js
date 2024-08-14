import SideNavigation from "../components/SideNavigation";
import Header from "../components/Header";
import CustomerTable from "../components/CustomerTable";

import styles from "./Customers.module.css";

const Customers = () => {

  return (
    <div className={styles.dashboard}>
      <Header />
      <SideNavigation />
      <CustomerTable />
    </div>
  );
};

export default Customers;
