import {Page, NavController, Modal, NavParams, ViewController, Alert} from 'ionic-angular';
import {DBService} from '../../dbService';

@Page({
	templateUrl: 'build/pages/task/subtask.html'
})

export class Subtask {
  static get parameters(){
		return[[ViewController], [NavController], [NavParams], [DBService]];
	}
	constructor(viewCtrl, nav, params, dbservice) {
    this.nav = nav;
		this.dbservice = dbservice;
    this.viewCtrl = viewCtrl;
    this.subtask = params.get("params") || {
			id: "",
      name: "",
      date: "",
      place: "",
			fk_list: "",
      done: false
    };
		console.log(this.subtask)	;
  }

  close(){
    this.viewCtrl.dismiss();
  }

	

  save(){
    if(this.subtask.name != ""){
			console.log(this.subtask);
			if(this.subtask.id != ""){
				this.dbservice.updateSubtask(this.subtask,(data) => {
					console.log("Actualizada");
					this.viewCtrl.dismiss(this.subtask);
				}, (error) =>{
					console.log("Error: " + JSON.stringify(error.err));
				});
			}else{
				this.viewCtrl.dismiss(this.subtask);
			}
    }else{
      let alert = Alert.create({
      	title: 'Nueva tarea',
        body: 'Debes introducir un nombre o descripción para la tarea',
        buttons: [
  				{
  					text: 'Aceptar',
  					role: 'cancel',
  					handler: () => {
  					}
  				}
        ]
      });
      this.nav.present(alert);
    }
  }
}
