import {registry} from "../main";

export class TaskInput extends React.Component{
    constructor(props) {
        super(props);
        this.taskList = this.props.taskList;
        this.state = {
            taskInputDisabled: false,
        };

        this.addTask = this.addTask.bind(this);
    }

    componentDidMount() {
        registry.taskInput = this;
    }

    componentWillUnmount() {
        registry.taskInput = null;
    }

    addTask(e) {
        e.preventDefault();

        let taskText = e.target['task_input_field'].value;

        if (taskText) {
            this.taskList.addTask(taskText);
        }
        e.target.reset();
    }

    render() {
        let taskInputSubmitFunction;
        let taskInputFieldDisabled;
        let taskInputButtonDisabled;

        if (this.state.taskInputDisabled === true) {
            taskInputSubmitFunction = null;
            taskInputFieldDisabled = true;
            taskInputButtonDisabled = true;
        } else {
            taskInputSubmitFunction = this.addTask;
            taskInputFieldDisabled = false;
            taskInputButtonDisabled = false;
        }
        return(
            <div className="task_input">
                <form onSubmit={taskInputSubmitFunction}>
                    <label htmlFor={'task_input_field'}/>
                        <input type={'text'}
                               name={'task_input_field'}
                               className={'task_input_field'}
                               autoComplete={'off'}
                               disabled={taskInputFieldDisabled}
                        />
                        <button type={'submit'}
                                className={'task_input_button'}
                                disabled={taskInputButtonDisabled}
                        >
                            <img src="/static/icons/add_sub.svg" alt="+"/>
                        </button>
                </form>
            </div>
        )
    }
}