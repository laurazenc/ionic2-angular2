import {Page, Modal, NavController, ViewController} from 'ionic-angular';
import {Task} from '../task/task';

@Page({
	templateUrl: 'build/pages/list/list.html'
})

export class ListPage { 

	static get parameters(){
		return[[ViewController], [NavController]];
	}

  constructor(viewCtrl, nav) {
		this.viewCtrl  = viewCtrl;
		this.nav = nav;
	}

	close(){
		this.viewCtrl.dismiss();
	}

	taskingList(){
		let modal = Modal.create(Task);
		this.nav.present(modal);
	}


}
