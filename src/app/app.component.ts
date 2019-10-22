// import { Component, OnInit } from '@angular/core';
import { Component, OnInit, ViewChild, ElementRef, Pipe, PipeTransform } from '@angular/core';
import {ChatService} from './chat.service'
import { throwError } from 'rxjs';
import {HttpClientModule} from '@angular/common/http'

import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-beautify';
import { DomSanitizer } from '@angular/platform-browser';


const THEME = 'ace/theme/github'; 
const LANG = 'ace/mode/javascript';


declare var $: any;

@Pipe({
  name: 'safe'
})

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css',
              
],
  providers:[ChatService]
})
export class AppComponent implements OnInit, PipeTransform{
  enableBasicAutocompletion: true
  selected_File = null;
  user: String;
  code: Number;
  
  file: String;
  start_challenge_flag: boolean;
  join_challenge_flag: boolean;
  main_challenge_flag:boolean;
  header_flag: boolean;
  exit_flag: boolean;
  messageArray: Array<{user: String, message: String}> = [];
  messageText: String;

  public imagePath;
  imgURL: any;
  public message: string;


  private editorBeautify;

  @ViewChild('codeEditor',{static: true}) codeEditorElmRef: ElementRef;
  private codeEditor: ace.Ace.Editor;


  @ViewChild('codeEditor2',{static: true}) codeEditorElmRef2: ElementRef;
  private codeEditor2: ace.Ace.Editor;
  constructor(private _chatService: ChatService, private sanitizer: DomSanitizer){
      //new user
      this._chatService.newUserJoined()
      .subscribe(data => this.messageArray.push(data));

      //new message
      this._chatService.newMessageRecieved()
      .subscribe(data => this.messageArray.push(data));
  }

  transform(url){
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

    preview(event) {
  
      var mimeType = event.target.files[0].type;
      
      // if (mimeType.match(/image\/*/) == null) {
      //   this.message = "Only images are supported.";
      //   return;
      // }
   
      var reader = new FileReader();
      this.imagePath = event.target.files;
      reader.readAsDataURL(event.target.files[0]); 

      reader.onload = (_event) => { 
        this.imgURL = reader.result; 
        console.log("dalal is here")
        console.log(this.imgURL); 
        // $window.open(this.img)       
      }
    }
  

  // constructor(private http:HttpClient){

  // }


  ngAfterViewInit(){
    
  }
  ngOnInit(){
    ace.require('ace/ext/language_tools');
    $(document).ready(()=>{
      $("#elementId").click(function(){
        console.log("upload clicked");

       })

       
    })    
    this.header_flag = true;
    this.exit_flag = false;

    
    const element = this.codeEditorElmRef.nativeElement;
    const editorOptions = this.getEditorOptions();

    this.codeEditor = ace.edit(element, editorOptions);
    this.codeEditor.setTheme(THEME);
    this.codeEditor.getSession().setMode(LANG);
    this.codeEditor.setShowFoldWidgets(true);

    const element2 = this.codeEditorElmRef2.nativeElement;
    const editorOptions2 = this.getEditorOptions();

    this.codeEditor2 = ace.edit(element2, editorOptions2);
    this.codeEditor2.setTheme(THEME);
    this.codeEditor2.getSession().setMode(LANG);
    this.codeEditor2.setShowFoldWidgets(true);

    this.editorBeautify = ace.require('ace/ext/beautify');
  }

  public beautifyContent() {
    if (this.codeEditor && this.editorBeautify) {
       const session = this.codeEditor.getSession();
       this.editorBeautify.beautify(session);
    }
 }

 private getCode() {
  const code = this.codeEditor.getValue();
  console.log(code);
}
    // missing propery on EditorOptions 'enableBasicAutocompletion' so this is a wolkaround still using ts
    private getEditorOptions(): Partial<ace.Ace.EditorOptions> & { enableBasicAutocompletion?: boolean; } {
      const basicEditorOptions: Partial<ace.Ace.EditorOptions> = {
          highlightActiveLine: true,
          minLines: 14,
          maxLines: Infinity,
      };

      const extraEditorOptions = {
          enableBasicAutocompletion: true
      };
      const margedOptions = Object.assign(basicEditorOptions, extraEditorOptions);
      return margedOptions;
  }


  onFileSelected(event){
    this.selected_File = event.target.files[0].name;
    console.log("the selected file is",this.selected_File);

  }
  onUpload(){

    // var fileURL = window.URL.createObjectURL(this.selected_File); 
    // console.log("before uploaded file is",fileURL);
    const fd = new FormData()
    fd.append('myfiel',this.selected_File)
    
    console.log("the uploaded file is");
   }
  join(){
    console.log('file ')
    console.log('file', this.file)
    this.header_flag = false;
    this.join_challenge_flag = false;
    this.main_challenge_flag = true;
    //this.exit_flag = true;
    console.log('user '+this.user+'joined by '+this.code+'file'+this.file)
    this._chatService.joinRoom({user: this.user, code: this.code, file: this.file});
  }

  sendMessage(){
    this._chatService.sendMessage({user: this.user, message:this.messageText, code: this.code})
  }

  start_challenge(){
    // this.header_flag = false;
    // this.exit_flag = true;
    this.start_challenge_flag = true;
    this.code = Math.floor(Math.random() * (1000) + 1);
  }

  join_challenge(){
    // this.header_flag = false;
    // this.exit_flag = true;

    this.start_challenge_flag = false;
    this.join_challenge_flag = true;
  }

  exit_challenge(){
    console.log('here')
    this.header_flag = true;
  }
 
}
