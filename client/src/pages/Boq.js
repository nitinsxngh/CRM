import SideNavigation from "../components/SideNavigation";
import Header from "../components/Header";
import BoqTable from "../components/BoqTable";

import styles from "./Dashboard.module.css";

const Boq = () => {

  return (
    <div className={styles.dashboard}>
      <Header />
      <SideNavigation />
      <BoqTable />
    </div>
  );
};

export default Boq;
