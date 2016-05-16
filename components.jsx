/// Common components ///

var React = require('react');
var ReactDOM = require('react-dom');
var DataSource = require('./models/dataSourceModel.js');
var AnswerModule = require('./models/answerModuleModel.js');

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

    componentDidMount: function () {
        $('.collapsible').collapsible();
    },

    componentDidUpdate: function () {
        $('.collapsible').collapsible();
    },

    render: function () {

        var serialize = this.props.model.serialize;
        var listElements = this.props.model.elements.map(function(object) {
                console.log(object);
                return (
                    <CollapsibleListElement
                        name={object.name}
                        pairs={serialize(object)}
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

dataSourceModel = new DataSource();
ReactDOM.render(
    <CollapsibleList model={dataSourceModel}/>,
    document.getElementById('dataSourcesContainer')
);

answerModelModule = new AnswerModule();
ReactDOM.render(
    <CollapsibleList model={answerModelModule}/>,
    document.getElementById('answerModulesContainer')
);

