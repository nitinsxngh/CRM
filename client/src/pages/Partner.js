import SideNavigation from "../components/SideNavigation";
import Header from "../components/Header";
import PartnerTable from "../components/PartnerTable";

import styles from "./Customers.module.css";

const Customers = () => {

  return (
    <div className={styles.dashboard}>
      <Header />
      <SideNavigation />
      <PartnerTable />
    </div>
  );
};

export default Customers;
