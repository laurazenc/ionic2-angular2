import { Pipe, DatePipe } from '@angular/core';
import { HomePage } from './home';

@Pipe({ 
	name: 'typeLists',
	pure: false
})

export class typeListsPipe {
  transform(value, filter) {		
    if(filter!="all"){			
		 return value.filter((item) => item.type == (filter));  
		}else{
			return value;
		}
	}
}

@Pipe({ 
	name: 'date',
	pure: true
})

export class datePipe {
  transform(value) {	
		console.log(value);
    console.log(Date(value));
		
		return new Pipe().transform(new Date(value), ['yyyy-MM-dd']);
	}
}