import React, {Component} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'reactstrap';
import fetch from 'isomorphic-fetch';
import BarChart from './components/BarChart'
import PieChart from './components/PieChart'

import logo from './logo.png'

var barColors = ['#e74c3c', '#f1c40f', '#2ecc71', '#3498db']

const getData = () => {
  return fetch('https://3b6gdit4v0.execute-api.us-east-2.amazonaws.com/latest/')
  .then(res => {
    return res.json()
  })
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rawData: null,
      pieChartData: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [
            '#e74c3c',
            '#f1c40f',
            '#2ecc71',
            '#3498db',
            '#9b59b6',
            '#34495e',
            '#e67e22',
            '#c0392b',
            '#7A942E',
            '#4834d4',
            '#1abc9c',
            '#BDC3C7'
          ]
        }]
      },
      barChartData: {
        labels: [],
        datasets: [
          {
            label: '2018-2019',
            data: [],
            backgroundColor: barColors[0]
          },
          {
            label: '2017-2018',
            data: [],
            backgroundColor: barColors[1],
            hidden: true
          },
          {
            label: '2016-2017',
            data: [],
            backgroundColor: barColors[2],
            hidden: true
          },
          {
            label: '2015-2016',
            data: [],
            backgroundColor: barColors[3],
            hidden: true
          },
        ]},
    }
  }

  filter (type) {
    var updatedLabels = []
    var data2018 = []
    var data2017 = []
    var data2016 = []
    var data2015 = []
    if (type == null) {
      //console.log(this.state.rawData)
      this.state.rawData.forEach((item) => {
        //console.log(JSON.stringify(item, null, 4))
        updatedLabels.push(item.activity)
        data2018.push(item[2018])
        data2017.push(item[2017])
        data2016.push(item[2016])
        data2015.push(item[2015])
      })

    } else {
      var allocable = type === "allocable"
      this.state.rawData.forEach((item) => {
        var boolVal = item.allocable === "true"
        if (boolVal === allocable) {
          updatedLabels.push(item.activity)
          data2018.push(item[2018])
          data2017.push(item[2017])
          data2016.push(item[2016])
          data2015.push(item[2015])
        }
      })
    }
    // make copy of the state
    let stateCopy = this.state

    // set the bar chart state
    stateCopy.barChartData.datasets[0].data = data2018
    stateCopy.barChartData.datasets[1].data = data2017
    stateCopy.barChartData.datasets[2].data = data2016
    stateCopy.barChartData.datasets[3].data = data2015
    stateCopy.barChartData.labels = updatedLabels

    var others = 0
    var aggregatedData = []
    var aggregatedLabels = []

    for (var i = 0; i < updatedLabels.length; i++) {
      if (i < 11) {
        aggregatedData.push(data2018[i])
        aggregatedLabels.push(updatedLabels[i])
      } else {
        others += parseInt(data2018[i], 10)
        if (i === updatedLabels.length - 1) {
          aggregatedData.push(others)
          aggregatedLabels.push("Others")
        }
      }
    }

    stateCopy.pieChartData.labels = aggregatedLabels
    stateCopy.pieChartData.datasets[0].data = aggregatedData

    this.setState({
      stateCopy
    })
  }

  componentDidMount() {
    getData().then(res => {
      this.setState({
        rawData: res
      })
      this.filter(null)
    })
  }

  render() {
    const filterAllocable = () => this.filter('allocable')
    const filterNonAllocable = () => this.filter('nonallocable')
    const resetFilter = () => this.filter(null)

    return (
        <div className="App" height="100%">
          <img src={logo} alt="logo"/>
          <h2>UWEC Segregated Fee Report</h2>
          <div className="container">
            <div className="content">
              <h3>What are Segreated Fees?</h3>
              <p>Segregated fees provide funds for cultural, recreational, and leisure activities and groups that are not funded through other state appropriations. They are intended to contribute to the richness of the university community. Segregated fees are not user fees. </p>
            </div>
            <button  type="button" className="btn btn-outline-danger btn-space" onClick={resetFilter.bind(this)}>All</button>
            <button type="button" className="btn btn-outline-danger btn-space" onClick={filterAllocable.bind(this)}>Allocable</button>
            <button type="button" className="btn btn-outline-danger btn-space" onClick={filterNonAllocable.bind(this)}>Non-Allocable</button>
            <h3 id="percentage">Spending as Percentage of Total</h3>
              <div className="pieHolder">
                <PieChart chartData={this.state.pieChartData}/>
            </div>
            <h3>Segregated Fee Spending by Activity</h3>
            <p><small>Click on the years to compare</small></p>
            <BarChart chartData={this.state.barChartData}/>

          </div>
          <footer className="navbar-fixed-bottom">
              <p><small>This page is brought to you by UWEC Student Senate as a collaboration between the Finance and Information Technology Comissions.</small></p>
          </footer>
        </div>
  );
  }
}

export default App;
