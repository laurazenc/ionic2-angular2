import {App, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HomePage} from './pages/home/home';
import {ListPage} from './pages/list/list';
import {DBService} from './dbService';


@App({
  templateUrl: 'build/app.html',
	providers: [DBService],
  config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})


export class MyApp {
  static get parameters() {
    return [[Platform]];
  }

  constructor(platform) {
    this.home = HomePage;
    this.list = ListPage;

    this.rootPage = this.home;

    platform.ready().then(() => {
      StatusBar.styleDefault();
    });
  }

  openPage(page){
    this.rootPage = page;
  }
}
