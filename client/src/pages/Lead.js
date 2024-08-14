import SideNavigation from "../components/SideNavigation";
import Header from "../components/Header";
import LeadTable from "../components/LeadTable";

import styles from "./Customers.module.css";

const Lead = () => {

  return (
    <div className={styles.dashboard}>
      <Header />
      <SideNavigation />
      <LeadTable />
    </div>
  );
};

export default Lead;
