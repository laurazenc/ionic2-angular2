import {Page, NavController, Modal, NavParams, ViewController, Alert} from 'ionic-angular';
import {Home} from '../home/home';
import {Subtask} from '../task/subtask';
import {DBService} from '../../dbService';

@Page({
	templateUrl: 'build/pages/task/task.html'
})

export class Task {

	static get parameters(){
		return[[NavController], [NavParams], [ViewController], [DBService]];
	}
	constructor(nav, params, viewCtrl, dbservice) {
		this.nav = nav;
		this.viewCtrl  = viewCtrl;
		this.dbservice = dbservice;
		this.type = 'tasking';
		this.id = params.get("id") || '';
		this.name = params.get("name") || '';
		this.tasks = params.get("subtasks") || [];
		console.log(this.tasks);
		this.submitted = false;
		this.saved = false;
	}

	save(){

		if(this.name != ''){
			let list = {id: this.id, name: this.name, subtasks: this.tasks};
			if(list.id != ''){
				this.dbservice.updateTask(list, (data) => {
					console.log(data);
				});
			}else{
				this.dbservice.newTask(list, (data) => {
					console.log(data);
				});
			}
		}
	}

	delete(task){
		let pos = this.tasks.indexOf(task);
		this.tasks.splice(pos, 1);
	}

	newTask(){
		let modal = Modal.create(Subtask);

		modal.onDismiss((data) => {
			if(data){
				this.tasks.push(data);
			}
		});

		this.nav.present(modal);
	}

	click(t){

		if(t.id != ''){
			//t.done = !t.done;
			this.dbservice.updateSubtask(t, (data) => {
				console.log('Hecho!');
			});
		}
	}

	edit(task){

		let modal = Modal.create(Subtask, {params: task});
		modal.onDismiss((data) => {
			//this.tasks.push(data);
			console.log(this.tasks);

		});

		this.nav.present(modal);
	}

	saveList(){

	}

	close(){
		this.viewCtrl.dismiss();
	}
}
