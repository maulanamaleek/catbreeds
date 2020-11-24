import React, { Component } from 'react';
import axios from 'axios';
import { Card, Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import InfiniteScroll from 'react-infinite-scroller';
import Logo from './assets/logo.png';

class App extends Component {
  constructor(){
    super()
    this.state = {
      cat: [],
      hasmore: true,
    }
  }

  componentDidMount(){
    axios.get('https://api.thecatapi.com/v1/breeds?page=0&limit=15&api_key=7459a40e-be79-4420-bcd2-08c6c649bb6b')
    .then(data => {
      console.log(data)
      this.setState({cat: data.data})})
  }

  fetchMoreData = async () => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    const check = this.state.cat.length / 15;
    const load = await axios.get(`https://api.thecatapi.com/v1/breeds?page=${check}&limit=15&api_key=7459a40e-be79-4420-bcd2-08c6c649bb6b`, {cancelToken: source.token})
                 .then(data=> data.data)
    const newData = [...this.state.cat, ...load];

    if(load.length === 0){
      this.setState({hasmore: false});
    }
    console.log(this.state.hasmore)
    this.setState({cat: newData});
    
  }

  render() {
    return (
      <div>
        <img className="logo" src={Logo} alt="Cat Breeds" />
        <InfiniteScroll
        initialLoad={false}
        loadMore={this.fetchMoreData}
        hasMore={this.state.hasmore}
        loader={(
          <div className="loader"></div>
        )}
        >
          <ul className="list-container">
            {this.state.cat.map(item => {
              return <li className="list-item" key={item.id}>
                <Accordion>
                  <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="0">
                      <b>{item.name}</b> - {item.origin}
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                      <Card.Body>
                        <div className="toogle-items">
                          <div>
                            <h5>Origin</h5>
                            <p>{item.origin}</p>
                          </div>
                          <div>
                            <h5>Weight</h5>
                            <p>{item.weight.metric} kg</p>
                          </div>

                          <h5>Description</h5>
                          {item.description}
                          <a href={item.wikipedia_url}>..More info</a>
                        </div>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              </li>
            })}
          </ul>
        </InfiniteScroll>

        <div className="footer">
          <p>Built with <a href="https://thecatapi.com" target="blank">TheCatApi</a></p>
        </div>
      </div>
    )
  }
}

export default App;