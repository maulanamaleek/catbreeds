import React, { Component } from 'react';
import axios from 'axios';
import { Card, Accordion, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import InfiniteScroll from 'react-infinite-scroller';
import Logo from './assets/logo.png';

class App extends Component {
  constructor(){
    super()
    this.state = {
      cat: [],
      hasmore: true,
      search: "",
      result: [],
    }
  }

  // get data from api after page load
  componentDidMount(){
    axios.get('https://api.thecatapi.com/v1/breeds?page=0&limit=10&api_key=7459a40e-be79-4420-bcd2-08c6c649bb6b')
    .then(data => this.setState({cat: data.data}))
  };

  // get more data when user scroll
  fetchMoreData = async () => {
    const check = this.state.cat.length / 10;
    const load = await axios.get(`https://api.thecatapi.com/v1/breeds?page=${check}&limit=15&api_key=7459a40e-be79-4420-bcd2-08c6c649bb6b`)
                       .then(data=> data.data);
    const newData = [...this.state.cat, ...load];

    if(load.length === 0){
      this.setState({hasmore: false});
    }
    
    this.setState({cat: newData});
  }

  // filter item that match with user input
  change = (e) => {
    this.setState({
      search: e.target.value,
    });

    const search = this.state.search;
    const item = this.state.cat.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
    const more = search.length ? false : true;

    this.setState({
      result: item,
      hasmore: more,
    })
  }

  //reset user input 
  click = () => {
    this.setState({
      search: "",
      result: [],
      hasMore: true,
    })
  }

  // display item that match with user input
  displayList = (item) => {
    return (
      <li className="list-item" key={item.id}>  
                  <Accordion style={{boxShadow: "1px 2px 5px rgba(0, 0, 0, 0.1)"}}>
                    <Card style={{backgroundColor: "#eee"}}>
                      <Card.Header style={{backgroundColor: "#76bbe9"}}>
                        <b>{item.name}</b> - {item.origin}
                        <Accordion.Toggle as={Button} eventKey="0" style={{backgroundColor: "#0278ae", cursor: "pointer", border: 0, float: "right", width: 100}}>
                        Details
                      </Accordion.Toggle>
                      </Card.Header>
                      
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>
                          <div className="toogle-items" key={item.id}>
                            <div className="flex-items">
                              <p><b>Origin: </b>{item.origin}</p>                            
                              <p><b>Weight: </b>{item.weight.metric} kg</p>
                              <p><b>Life Span: </b>{item.life_span} years</p>
                            </div>

                            <h6>Description</h6>
                            <p>{item.description}-<a href={item.wikipedia_url}>More info</a></p>

                            <h6>Temperament</h6>
                            <p>{item.temperament}</p>
                            
                          </div>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion>
                </li>
    )
  }
  render() {
    return (
      <div>
        <img className="logo" src={Logo} alt="Cat Breeds" />

        <div className="search">
          <form>
            <input type="text" placeholder="Search cat name" value={this.state.search} onChange={this.change} />
            <button onClick={this.click}>x</button>
          </form>
        </div>

        <InfiniteScroll
        initialLoad={false}
        loadMore={this.fetchMoreData}
        hasMore={this.state.hasmore}
        loader={(
          <div className="loader" key={0}></div>
        )}
        >
          {this.state.search !== "" ? <h5 className="result-head">Result for "{this.state.search}"</h5> : null}
          
          <ul className="list-container">
            { this.state.search.length 
              ? 
              this.state.result.map(result => this.displayList(result))
              : 
              this.state.cat.map( item => this.displayList(item))
            }
          </ul>
        </InfiniteScroll>
          
        <div className="footer">
          <p>Malik 2020 | Built with <a href="https://thecatapi.com" target="blank">TheCatApi</a></p>
        </div>

      </div>
    )
  }
}

export default App;