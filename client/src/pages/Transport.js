import SideNavigation from "../components/SideNavigation";
import Header from "../components/Header";
import TransportTable from "../components/TransportTable";

import styles from "./Customers.module.css";

const Transports = () => {

  return (
    <div className={styles.dashboard}>
      <Header />
      <SideNavigation />
      <TransportTable />
    </div>
  );
};

export default Transports;
