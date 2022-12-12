import { useState, useEffect } from "react";
import { Antelope } from "../utils/constants";

export default () => {
  const [data, setData] = useState<Array<Antelope>>([]);
  const [error, setError] = useState();
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setRefetch(false);
    fetch("https://antelopes.s3.eu-west-1.amazonaws.com/species.json", {
      method: "GET",
    })
      .then((r) => r.json())
      .then((data: Array<Antelope>) => (setData(data), setError(undefined), data))
      .catch((error) => (setData([]), setError(error)))
      .finally(() => setLoading(false));
  }, [refetch]);
  return { data, error, loading, refetch: () => setRefetch(true) };
};
