import React from "react";
import "./Home.css";
import {
  API_URL,
  API_KEY,
  IMAGE_BASE_URL,
  BACKDROP_SIZE,
  POSTER_SIZE
} from "../../config";
import HeroImage from "../elements/HeroImage/HeroImage";
import SearchBar from "../elements/SearchBar/SearchBar";
import FourColGrid from "../elements/FourColGrid/FourColGrid";
import MovieThumb from "../elements/MovieThumb/MovieThumb";
import Spinner from "../elements/Spinner/Spinner";
import LoadMoreBtn from "../elements/LoadMoreBtn/LoadMoreBtn";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      heroImage: null,
      loading: false,
      currentPage: 0,
      totalPages: 0,
      searchTerm: ""
    };
  }

  componentDidMount() {
    if (localStorage.getItem("HomeState")) {
      const state = JSON.parse(localStorage.getItem("HomeState"));
      this.setState({ ...state });
    } else {
      this.setState({
        loading: true
      });
      const endPoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
      this.fetchItem(endPoint);
    }
  }

  searchItems = searchTerm => {
    console.log(searchTerm);
    let endPoint = "";
    this.setState({
      movies: [],
      loading: true,
      searchTerm: searchTerm
    });
    if (searchTerm === "") {
      endPoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
    } else {
      endPoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${searchTerm}`;
    }
    this.fetchItem(endPoint);
  };

  loadMoreItems = () => {
    let endPoint = "";
    this.setState({ loading: true });
    if (this.state.searchTerm === "") {
      endPoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${this
        .state.currentPage + 1}`;
    } else {
      endPoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${
        this.state.searchTerm
      }&page=${this.state.currentPage + 1}`;
    }
    this.fetchItem(endPoint);
  };

  fetchItem = endPoint => {
    fetch(endPoint)
      .then(res => res.json())
      .then(json => {
        this.setState(
          {
            movies: [...this.state.movies, ...json.results],
            heroImage: this.state.heroImage || json.results[0],
            loading: false,
            currentPage: json.page,
            totalPages: json.total_pages
          },
          () => {
            if (this.state.searchTerm === "") {
              localStorage.setItem("HomeState", JSON.stringify(this.state));
            }
          }
        );
      });
  };

  render() {
    return (
      <div className="rmdb-home">
        {this.state.heroImage ? (
          <div>
            <HeroImage
              images={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${this.state.heroImage.backdrop_path}`}
              title={this.state.heroImage.original_title}
              text={this.state.heroImage.overview}
            />
            <SearchBar callback={this.searchItems} />
          </div>
        ) : null}
        <div className="rmdb-home-grid">
          <FourColGrid
            header={this.state.searchTerm ? "Search Result" : "Popular Movies"}
            loading={this.state.loading}
          >
            {this.state.movies.map((element, i) => {
              return (
                <MovieThumb
                  key={i}
                  clickable={true}
                  image={
                    element.poster_path
                      ? `${IMAGE_BASE_URL}${POSTER_SIZE}${element.poster_path}`
                      : "./images/no_image.jpg"
                  }
                  movieId={element.id}
                  movieName={element.original_title}
                />
              );
            })}
          </FourColGrid>
          {this.state.loading ? <Spinner /> : null}
          {this.state.currentPage <= this.state.totalPages &&
          !this.state.loading ? (
            <LoadMoreBtn text="Load More" onClick={this.loadMoreItems} />
          ) : null}
        </div>
      </div>
    );
  }
}

export default Home;
