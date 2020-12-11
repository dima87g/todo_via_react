export class LoadingWindow extends React.Component {
    constructor() {
        super();
        this.isAlive = false;
        this.reqCount = 0;
        this.timerShow = null;
        this.timerHide = null;
        this.startTime = null;
        this.stopTime = null;
        this.state = {
            visibility: 'hidden',
        }
        this.showWindow = this.showWindow.bind(this);
        this.hideWindow = this.hideWindow.bind(this);
    }

    showWindow() {
        this.reqCount++;
        if (this.reqCount === 1) {
            this.timerHide = clearTimeout(this.timerHide);
            this.timerShow = setTimeout(() => {
                this.setState({
                    visibility: 'visible',
                })
                this.startTime = Date.now();
                this.isAlive = true;
            }, 200);
        }
    }

    hideWindow() {
        if (this.reqCount > 0) {
            this.reqCount--;
            this.stopTime = Date.now();
        }
        if (this.reqCount === 0) {
            this.timerShow = clearTimeout(this.timerShow);
            if (this.isAlive) {
                if (this.stopTime - this.startTime >= 200) {
                    this.setState({
                        visibility: 'hidden',
                    })
                    this.isAlive = false;
                } else {
                    this.timerHide = setTimeout(() => {
                        this.setState({
                            visibility: 'hidden',
                        })
                        this.isAlive = false;
                    }, 200 - (this.stopTime - this.startTime));
                }
            }
        }
    }
    render() {
        return(
            <div className={'loading_window'}
                 id={'loading_window'} style={
                     {
                         visibility: this.state.visibility,
                     }}>
                <p className={'loading_window_message'}
                   id={'loading_window_message'}>
                    ГРУЖУСЬ
                </p>
            </div>
        )
    }
}