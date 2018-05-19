import { Component, OnInit } from '@angular/core';

import {Events, ModalController, NavController, ViewController} from 'ionic-angular';
import { AddPlacePage } from "../add-place/add-place";
import { Place } from "../../models/place";
import { Storage } from "@ionic/storage";
import {LoginPage} from "../login/login";
//import { LocalNotifications } from '@ionic-native/local-notifications';
//import { PlacesService } from "../../services/post";
import { Posts } from "../../services/post-service";
import { ShowPage } from "../show/show";

@Component({
    selector: 'page-stats',
    templateUrl: 'stats.html',
})
export class StatsPage implements OnInit {
    addPlacePage = AddPlacePage;
    places: Place[] = [];
    posts: Posts[] = [];
    isLoggedIn: boolean = false;
    isNotLoggedIn: boolean = true;
    recent_activity = [];
    username = '';
    number_challenges = 0;
    totalScore = 0;
    perticipants = [];
    total_parti = [];

    constructor(private modalCtrl: ModalController,
                private navCtrl: NavController,
                private postService: Posts,
                private storage: Storage,
                private viewCtrl: ViewController,
                public events: Events,


    ) {
        events.subscribe('reloadPage1',() => {
            //this.navCtrl.setRoot(HomePage);
            window.location.reload();
            //this.updateContent();
            console.log('functional called');
        });

        this.storage.get('token').then((val) => {
            if(val!="" && val!= null){
                this.isNotLoggedIn = false;
                this.isLoggedIn = true;
            }
        });

        this.storage.get('psactivity').then((val) => {
            if(val!="" && val!= null){
             this.recent_activity = val;

            }
        });

        this.storage.get('username').then((val) => {
            if(val!="" && val!= null){
                this.username = val;
                this.postService.getScore(this.username).then((data) => {
                    if (typeof data !== 'undefined' && data.length > 0) {
                        this.number_challenges =  data[0]['count']-1;
                        this.totalScore = data[0]['total'];
                    }
                    else{
                        this.number_challenges = 0;
                        this.totalScore = 0;
                    }


                });
            }
        });

        this.postService.getTopFivet().then((data) => {
            if (typeof data !== 'undefined' && data.length > 0) {
               console.log('data '+ JSON.stringify(data));
                this.total_parti = Array(data.length).fill(1).map((x,i)=>i);
                this.perticipants = data;
            }
            else{
                this.number_challenges = 0;
            }


        });


    }

    ngOnInit() {
        this.storage.get('token').then((val) => {
            if(val!="" && val!= null){
                this.isLoggedIn = true;
            }
            if(!this.isLoggedIn){
                this.navCtrl.setRoot(LoginPage);
            }
        });

        this.postService.getposts().then((data) => {
            this.posts = data;
            console.log(data);
        });
    }
    onOpenPost(id: number) {
        this.navCtrl.push(ShowPage, {id:id});
    }

    updateContent(){
        this.postService.getposts().then((data) => {
            this.posts = data;
            console.log(data);
        });
        console.log('no data');
    }


}

