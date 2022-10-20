
import React, { useEffect, useState } from "react";
import RepoList from "../Components/RepoList";
import Loading from "../Components/Loading";

import axios from "axios";
import moment from "moment";

const App = () => {
  const [data, setData] = useState({
    repo: [],
    error: "",
    page: 1,
    loading: true
  });

  useEffect(() => {
    loadRepo();
    window.addEventListener("scroll", handleLoadMore);
  }, []);

  const loadRepo = () => {
    const { page, repo } = data;

    const DATE_30_DAYS_BEFORE = moment()
      .subtract(30, "days")
      .format("YYYY-MM-DD");

    // Getting the data from Github API

    axios
      .get(
        ` https://api.github.com/search/repositories?q=created:>${DATE_30_DAYS_BEFORE}&sort=stars&order=desc&page=${page}`
      )
      .then((resp) => {
        console.log(resp);

        setData({
          repo: [...repo, ...resp.data.items], // here when scrolling, Repo get updated instantly
          loading: false
        });

        // console.log("Repo Updated: ", repo);
      })

      .catch((error) => {
        setData({
          error: error,
          loding: false
        });
      });
  };

  const handleLoadMore = () => {
    const { loading } = data;

    if (
      window.pageYOffset + window.innerHeight >= window.innerHeight &&
      !loading
    ) {
      loadData();
    }
  };

  const loadData = () => {
    const { page } = data;

    setData((prevdata) => ({
      page: prevdata.page + page,
      loading: true
    }));
    loadRepo();
  };
  const render = () => {
    const { repo } = data;
    return repo;
  };
  

  return (
    <div>
      <RepoList repo={render()} />
      <Loading />
    </div>
  );
  //}
};

export default App;
