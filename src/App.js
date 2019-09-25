import React from "react";
import "./App.css";
import Header from "./components/elements/Header/Header";
import Home from "./components/Home/Home";
import NotFound from "./components/elements/NotFound/NotFound";
import Movie from "./components/Movie/Movie";
import { BrowserRouter, Route, Switch } from "react-router-dom";
const App = () => {
  return (
    <BrowserRouter>
      <>
        <Header />
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/:movieId" component={Movie} exact />
          <Route component={NotFound} />
        </Switch>
      </>
    </BrowserRouter>
  );
};

export default App;
