import React, {Component} from 'react';
import './App.css';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            age: 25,
            nickname: ''
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.handleEdit = this.handleEdit.bind(this);

    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSave(event) {
        let personTable = !localStorage.getItem('personTable') ? [] : JSON.parse(localStorage.getItem('personTable'));
        let runningPersonId = !localStorage.getItem('runningPersonId') ? 1 : parseInt(localStorage.getItem('runningPersonId'), 10);

        let person = this.state;
        personTable.push({
            id: runningPersonId,
            name: person.name,
            age: person.age,
            nickname: person.nickname
        });

        this.setState({
            name: '',
            age: 25,
            nickname: ''
        });

        localStorage.setItem('personTable', JSON.stringify(personTable));
        localStorage.setItem('runningPersonId', parseInt(runningPersonId, 10) + 1);
        this.forceUpdate();
    }

    handleDelete(event) {
        const target = event.target;
        const person_id = parseInt(target.getAttribute('data-id'), 10);
        let rowElement = target.parentNode.parentNode.childNodes;
        let controlElement = rowElement[3];

        let editBtnElement = controlElement.childNodes[0];

        if (target.innerText === 'Edit') {
            let personTable = !localStorage.getItem('personTable') ? [] : JSON.parse(localStorage.getItem('personTable'));
            personTable = personTable.filter(person => person_id !== parseInt(person.id, 10));
            localStorage.setItem('personTable', JSON.stringify(personTable));
            this.forceUpdate();
        } else if (target.innerText === 'Not Save') {
            target.innerText = 'Delete';
            editBtnElement.innerText = 'Edit';

            let nameElement = rowElement[0];
            let ageElement = rowElement[1];
            let nicknameElement = rowElement[2];

            nameElement.innerText = nameElement.firstChild.getAttribute('data-beforeEditData');
            ageElement.innerText = ageElement.firstChild.getAttribute('data-beforeEditData');
            nicknameElement.innerText = nicknameElement.firstChild.getAttribute('data-beforeEditData');
        }
    }

    handleClear(event) {
        this.setState({
            name: '',
            age: 25,
            nickname: ''
        });
    }

    handleEdit(event) {
        const target = event.target;
        let rowElement = target.parentNode.parentNode.childNodes;
        let person_id = target.parentNode.parentNode.getAttribute('data-person_id');
        let nameElement = rowElement[0];
        let ageElement = rowElement[1];
        let nicknameElement = rowElement[2];
        let controlElement = rowElement[3];

        let deleteBtnElement = controlElement.childNodes[1];

        if (target.innerText === 'Edit') {
            target.innerText = 'Save';
            deleteBtnElement.innerText = 'Not Save';

            nameElement.innerHTML = '<input type="text" value="' + nameElement.innerText +
                '" class="App-input" name="name[' + person_id + ']" data-beforeEditData="' + nameElement.innerText + '">';
            ageElement.innerHTML = '<input type="number" value="' + ageElement.innerText +
                '" class="App-input" name="age[' + person_id + ']" data-beforeEditData="' + ageElement.innerText + '">';
            nicknameElement.innerHTML = '<input type="text" value="' + nicknameElement.innerText +
                '" class="App-input" name="nickname[' + person_id + ']" data-beforeEditData="' + nicknameElement.innerText + '">';
        } else if (target.innerText === 'Save') {
            target.innerText = 'Edit';
            deleteBtnElement.innerText = 'Delete';

            nameElement.innerText = nameElement.firstChild.value;
            ageElement.innerText = ageElement.firstChild.value;
            nicknameElement.innerText = nicknameElement.firstChild.value;

            let personTable = !localStorage.getItem('personTable') ? [] : JSON.parse(localStorage.getItem('personTable'));

            let dataToUpdate = {
                id: person_id,
                name: nameElement.innerText,
                age: ageElement.innerText,
                nickname: nicknameElement.innerText
            };

            personTable = personTable.map((person) => {
                return (parseInt(person_id, 10) === parseInt(person.id, 10)) ? dataToUpdate : person;
            });
            console.log(personTable);
            localStorage.setItem('personTable', JSON.stringify(personTable));
        }
    }

    render() {
        let personTable = !localStorage.getItem('personTable') ? [] : JSON.parse(localStorage.getItem('personTable'));

        return (
            <div className="App">
                <form>
                    <table className="App-myTable">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Nickname</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>

                        {personTable.map((person, i) =>
                            <tr key={person.id} data-person_id={person.id}>
                                <td>{person.name}</td>
                                <td>{person.age}</td>
                                <td>{person.nickname}</td>
                                <td>
                                    <button type="button" className="App-button_default" onClick={this.handleEdit}>
                                        Edit
                                    </button>
                                    <button type="button" className="App-button_danger" onClick={this.handleDelete}
                                            data-id={person.id}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        )}

                        <tr>
                            <td colSpan="4" className="App-space"/>
                        </tr>

                        <tr>
                            <td>
                                <input type="text" value={this.state.name} className="App-input"
                                       onChange={this.handleInputChange} name="name"/>
                            </td>
                            <td>
                                <input type="number" value={this.state.age} className="App-input"
                                       onChange={this.handleInputChange} name="age"/>
                            </td>
                            <td>
                                <input type="text" value={this.state.nickname} className="App-input"
                                       onChange={this.handleInputChange} name="nickname"/>
                            </td>
                            <td>
                                <button type="button" className="App-button_success" onClick={this.handleSave}>Save
                                </button>
                                <button type="button" className="App-button_default" onClick={this.handleClear}>Cancel
                                </button>
                            </td>
                        </tr>
                        </tbody>


                    </table>
                </form>
            </div>
        );
    }
}

export default App;
