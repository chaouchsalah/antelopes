import { useEffect } from "react";
import { Switch, Route } from "wouter";
import useFetchAntellopes from "./api/useFetchAntellopes";
import Alert from "./components/Alert";
import Navigation from "./components/Navigation";
import { useDataStore } from "./stores/data.store";
import Details from "./views/Details";
import Landing from "./views/Landing";

const ALL_GROUPS = ["A", "B"];
type Group = typeof ALL_GROUPS[number];
const randomGroup = (): Group =>
  ALL_GROUPS[Math.floor(Math.random() * ALL_GROUPS.length)];

const App = () => {
  const { set } = useDataStore();
  const { data, loading, error, refetch } = useFetchAntellopes();
  useEffect(() => {
    if (data) {
      set(data);
    }
  }, [data]);
  const group = localStorage.getItem("group");
  if (!group) {
    localStorage.setItem("group", randomGroup());
  }
  return (
    <div>
      <Navigation />
      {loading || error ? (
        <Alert loading={loading} error={error} onTryAgain={refetch} />
      ) : (
        <Switch>
          <Route key="landing" component={Landing} />
          <Route key="details" path="/details" component={Details} />
        </Switch>
      )}
    </div>
  );
};

export default App;
