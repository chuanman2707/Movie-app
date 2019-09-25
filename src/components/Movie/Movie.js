import React, { Component } from "react";
import { API_KEY, API_URL } from "../../config";
import Navigation from "../elements/Navigation/Navigation";
import MovieInfo from "../elements/MovieInfo/MovieInfo";
import MovieInfoBar from "../elements/MovieInfoBar/MovieInfoBar";
import FourColGrid from "../elements/FourColGrid/FourColGrid";
import Actor from "../elements/Actor/Actor";
import Spinner from "../elements/Spinner/Spinner";
import "./Movie.css";

export default class Movie extends Component {
  state = {
    movie: null,
    actors: null,
    directors: [],
    loading: false
  };

  componentDidMount() {
    const localstate = `${this.props.match.params.movieId}`;
    if (localStorage.getItem(localstate)) {
      const state = JSON.parse(localStorage.getItem(localstate));
      this.setState({ ...state });
    }
    this.setState({ loading: true });
    const endPoint = `${API_URL}movie/${this.props.match.params.movieId}?api_key=${API_KEY}&language=en-US`;
    this.fetchItems(endPoint);
  }

  fetchItems = endPoint => {
    const localstate = `${this.props.match.params.movieId}`;
    fetch(endPoint)
      .then(res => res.json())
      .then(result => {
        if (result.status_code) {
          this.setState({ loading: false });
        } else {
          this.setState(
            {
              movie: result
            },
            () => {
              const endPoint = `${API_URL}movie/${this.props.match.params.movieId}/credits?api_key=${API_KEY}`;

              fetch(endPoint)
                .then(res => res.json())
                .then(result => {
                  const directors = result.crew.filter(
                    member => member.job === "Director"
                  );

                  this.setState(
                    {
                      actors: result.cast,
                      directors: directors,
                      loading: false
                    },
                    () => {
                      localStorage.setItem(
                        localstate,
                        JSON.stringify(this.state)
                      );
                    }
                  );
                });
            }
          );
        }
      })
      .catch(err => console.log("error", err));
  };

  render() {
    return (
      <div className="rmdb-movie">
        {this.state.movie ? (
          <div>
            <Navigation movie={this.props.location.movieName} />
            <MovieInfo
              movie={this.state.movie}
              directors={this.state.directors}
            />
            <MovieInfoBar
              time={this.state.movie.runtime}
              budget={this.state.movie.budget}
              revenue={this.state.movie.revenue}
            />
          </div>
        ) : null}
        {this.state.actors ? (
          <div className="rmdb-movie-grid">
            <FourColGrid header={"Actors"}>
              {this.state.actors.map((data, i) => {
                return <Actor key={i} actor={data} />;
              })}
            </FourColGrid>
          </div>
        ) : null}
        {!this.state.actors && !this.state.loading ? (
          <h1>No Movie Found</h1>
        ) : null}
        {this.state.loading ? <Spinner /> : null}
      </div>
    );
  }
}
