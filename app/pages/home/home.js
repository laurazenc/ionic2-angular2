import {Page, NavController, Modal, NavParams, ViewController} from 'ionic-angular';
import {typeListsPipe, datePipe} from './filters';
import {ListPage} from '../list/list';
import {Task} from '../task/task';
import {DBService} from '../../dbService';



@Page({
  templateUrl: 'build/pages/home/home.html',
	pipes: [typeListsPipe, datePipe]
})

export class HomePage {

	static get parameters(){
		return[[NavController], [DBService]];
	}

  constructor(nav, dbservice) {
		this.nav = nav;
		this.dbservice = dbservice;
		this.filter = 'all';
		this.lists = [];
		this.st = [];
		this.showList();
  }

	showList(){
		this.dbservice.getAllLists((lista) =>{

      this.lists = lista;
      for(let i=0;i<this.lists.length; i++){

        this.dbservice.getListData(this.lists[i].id, this.lists[i].type).then((data)=>{

          let pending = 0;
          let subtasks = [];
          for (let j=0; j< data.res.rows.length; j++){

            if (data.res.rows.item(j).done) { console.log(data.res.rows.item(j).done);pending++; };
            subtasks.push(data.res.rows.item(j));
            console.log(pending);

          }

          this.lists[i].subtasks = subtasks;
          this.lists[i].pending = pending;

        });
      }
    });
	}

  edit(list){
    if(list.type == "tasking"){
      let modal = Modal.create(Task, {id: list.id, name: list.name, subtasks: list.subtasks});

      modal.onDismiss((data) => {
  			this.showList();
  		});

  		this.nav.present(modal);
    }
  }

  delete(list){
    // let modal = Modal.create(ListPage);
		// this.nav.present(modal);
  }

	percentage(num){
		return 100/num;
	}

	newList(){
		let modal = Modal.create(ListPage);
		this.nav.present(modal);
	}

	onSegmentChanged($event){
		this.filter = $event.value;
	}



}
