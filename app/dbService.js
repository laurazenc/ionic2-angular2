import {SqlStorage, Storage} from 'ionic-angular';
import {Injectable} from '@angular/core';

@Injectable()
export class DBService{
	constructor(){
		this.storage = new Storage(SqlStorage);
		// this.storage.query("DROP TABLE IF EXISTS LIST");
		//this.storage.query("DROP TABLE IF EXISTS ST_TASKING");

		this.storage.query("CREATE TABLE IF NOT EXISTS LIST (id integer primary key autoincrement , name text, type text, created_at DATE DEFAULT (datetime('now','localtime')))");
		this.storage.query('CREATE TABLE IF NOT EXISTS ST_TASKING (id integer primary key autoincrement , name text, date date, place text, done boolean, fk_list integer )');

		// this.storage.query('INSERT INTO LIST (name, type) VALUES ("lista1", "tasking")');
		// this.storage.query('INSERT INTO ST_TASKING (name, date, place, pending, fk_list) VALUES ("subtask1","24/12/2016" ,"Escuela", 1,1)');
		// this.storage.query('INSERT INTO ST_TASKING (name, date, place, pending, fk_list) VALUES ("subtask2","24/12/2016" ,"Escuela", 0, 1)');
		// this.storage.query('INSERT INTO ST_TASKING (name, date, place, pending, fk_list) VALUES ("subtask3","24/12/2016" ,"Escuela", 0, 1)');



	}

	getAllLists(successCallback){
		let storage = new Storage(SqlStorage);
		storage.query('SELECT * FROM LIST ORDER BY created_at DESC').then((data) => {

			let lists = [];
				for (var i=0; i< data.res.rows.length; i++){
					// // Get subtasks
					//  this.getListData(data.res.rows.item(i).id, data.res.rows.item(i).type).then((result) =>{
					// 	 console.log(result);
					// 	 let subtasks = [];
					// 	 let pending = 0;
					// 	 if(result.res.rows.length > 0){
					// 	 	for (var j=0; j< result.res.rows.length; j++){
					// 	 		if (result.res.rows.item(j).pending == 1) {pending+=1};
					//
					// 	 		subtasks.push({
					// 	 			id: result.res.rows.item(j).id,
					// 	 			name: result.res.rows.item(j).name,
					// 	 			date: result.res.rows.item(j).date,
					// 	 			place: result.res.rows.item(j).place,
					// 	 			pending: result.res.rows.item(j).pending
					// 	 		});
					//
					// 	 	}
					//
					// 	 }

						 lists.push({
						 	id: data.res.rows.item(i).id,
						 	name: data.res.rows.item(i).name,
						 	type: data.res.rows.item(i).type,
						 	created_at: data.res.rows.item(i).created_at,
						 	subtasks: [],
						 	pending: 0
						 });

					//  });
				}
			successCallback(lists);
		}, (error) =>{
			console.log("Error al seleccionar listas " + JSON.stringify(error.err));
		});
	}

	getListData(id, type){

		let storage = new Storage(SqlStorage);
		if(type == 'shopping'){

		}else if(type === 'tasking'){
			return storage.query('SELECT * FROM ST_TASKING WHERE fk_list = '+ id +' ORDER BY done DESC');
		}else if(type == 'traveling'){

		}


	}

	// tasksking
	newTask(list, successCallback){
		let storage = new Storage(SqlStorage);
		storage.query('INSERT INTO LIST(name, type) VALUES(?,?)', [list.name, "tasking"]).then((data) =>{
			list.id = data.res.insertId;
			if(list.subtasks.length > 0){
				for(let i=0; i< list.subtasks.length; i++){
					storage.query('INSERT INTO ST_TASKING (name, date, place, done, fk_list) VALUES (?,?,?,?,?)', [list.subtasks[i].name, list.subtasks[i].date, list.subtasks[i].place, list.subtasks[i].done, list.id]).then((data) =>{
						console.log("Añadida sublista");
					});
				}
			}
			successCallback(list);
		}, (error) => {
			console.log("Error al crear lista " + JSON.stringify(error.err));
		});
	}

	updateSubtask(list,successCallback){
		let storage = new Storage(SqlStorage);
		
		storage.query('UPDATE ST_TASKING SET name = ?, date = ?, place = ?, done = ? WHERE id = ?', [list.name, list.date, list.place, list.done, list.id]).then((data) =>{
			console.log(data);
			successCallback(list);
		}, (error) => {
			console.log("Error al crear lista " + JSON.stringify(error.err));
		});
	}


	updateTask(list, successCallback){
		let storage = new Storage(SqlStorage);

		storage.query('UPDATE LIST SET name = ? WHERE id = ?', [list.name, list.id]);
		if(list.subtasks.length > 0){
			for(let i=0; i< list.subtasks.length; i++){
				console.log(list.id);
				if(list.subtasks[i].id != ''){
					storage.query('UPDATE ST_TASKING SET name = ?, date = ?, place = ?, done = ? WHERE id = ?', [list.subtasks[i].name, list.subtasks[i].date, list.subtasks[i].place, list.subtasks[i].done, list.subtasks[i].id]).then((data) =>{
						successCallback(list);
					}, (error) => {
						console.log("Error al crear lista " + JSON.stringify(error.err));
					});
				}else{

					list.subtasks[i].fk_list = list.id;
					storage.query('INSERT INTO ST_TASKING (name, date, place, done, fk_list) VALUES (?,?,?,?,?)', [list.subtasks[i].name, list.subtasks[i].date, list.subtasks[i].place, list.subtasks[i].done, list.id]).then((data) =>{
						console.log("Añadida sublista");
						successCallback(list);
					},(error) =>{
						console.log("Error al crear lista " + JSON.stringify(error.err));
					});

				}

			}
		}
	}

	deleteTask(list, successCallback){

	}

	// traveling
	// shopping
}
