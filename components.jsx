/// Common components ///

var React = require('react');
var ReactDOM = require('react-dom');
var DataSources = require('./models/DataProcessorModels/dataSourceModel');
//var AnswerModule = require('./models/answerModuleModel.js');
var AnswerModules = require('./models/DataProcessorModels/answerModuleModel');

var CollapsibleHeader = React.createClass({
    render: function () {
        return (
            <div className="collapsible-header">
                <span className="title">{this.props.title}</span>
            </div>
        )
    }
});

var CollapsibleBody = React.createClass({
    render: function () {
        var pairs = this.props.pairs.map(function (pair) {
            return ([<strong>{pair.name}: </strong>, pair.value, <br/>]);
        });

        return (
            <div className="collapsible-body">
                <p>{pairs}</p>
            </div>
        )
    }
});

var CollapsibleListElement = React.createClass({

    render: function () {
        return (
            <li>
                <CollapsibleHeader title={this.props.name}/>
                <CollapsibleBody pairs={this.props.pairs}/>
            </li>
        )
    }
});

var CollapsibleList = React.createClass({

    //getInitialState: function() {
    //    return {elements : this.props.model.elements}
    //},

    componentDidMount: function () {
        //var self = this;
        //this.props.model.loadAll(function () {
        //    self.setState({elements: self.props.model.elements});
        //});

        $('.collapsible').collapsible();
    },

    componentDidUpdate: function () {
        $('.collapsible').collapsible();

    },

    render: function () {

        var listElements = this.props.model.elements.map(function(object) {

        //var listElements = this.state.elements.map(function(object) {

 //               console.log(object);
                return (
                    <CollapsibleListElement
                        name={object.name}
                        //pairs={serialize(object)}
                        pairs={object.serialize()}
                    />
                )
            });

        return (
            <ul className="collapsible">
                {listElements}
            </ul>
        )
    }
});



function renderDataSources() {
    ReactDOM.render(
        <CollapsibleList model={DataSources}/>,
        document.getElementById('dataSourcesContainer')
    );
};


DataSources.subscribe(renderDataSources)
DataSources.loadAll()


function renderAnswerModules() {
    ReactDOM.render(
        <CollapsibleList model={AnswerModules}/>,
        document.getElementById('answerModulesContainer')
    );
};

AnswerModules.subscribe(renderAnswerModules);
AnswerModules.loadAll();