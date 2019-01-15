import {NestedTreeControl} from '@angular/cdk/tree';
import {Component, Injectable} from '@angular/core';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';
import { JsonTag } from './jsonTag'


export const JSONTAGS: JsonTag[] = [
  { openTag: '"', endTag: '"' },
  { openTag: '{', endTag: '}' },
  { openTag: ':', endTag: '' },
  { openTag: '[', endTag: ']' },
  ];


/**
 * Json node data with nested structure. Each node has a filename and a value or a list of children
 */
export class FileNode {
  children: FileNode[];
  filename: string;
  type: any;
}


/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
@Injectable()
export class FileDatabase {
  dataChange = new BehaviorSubject<FileNode[]>([]);

  get data(): FileNode[] { return this.dataChange.value; }

  constructor() {
    this.initialize();
  }

  initialize() {
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `FileNode`.
   */
  buildFileTree(obj: {[key: string]: any}, level: number): FileNode[] {
    return Object.keys(obj).reduce<FileNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new FileNode();
      node.filename = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.type = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }
}
@Component({
  selector: 'app-jsoneditor',
  templateUrl: './jsoneditor.component.html',
  styleUrls: ['./jsoneditor.component.css'],
  providers: [FileDatabase]

})
export class JsoneditorComponent  {
 jsonTags = JSONTAGS;
 jsonString: string;
 
  nestedTreeControl: NestedTreeControl<FileNode>;
  nestedDataSource: MatTreeNestedDataSource<FileNode>;

  constructor(database: FileDatabase) {
    this.nestedTreeControl = new NestedTreeControl<FileNode>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();

    database.dataChange.subscribe(data => this.nestedDataSource.data = data);
  }

  hasNestedChild = (_: number, nodeData: FileNode) => !nodeData.type;

  private _getChildren = (node: FileNode) => node.children;

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `FileNode`.
   */
  buildFileTree(obj: {[key: string]: any}, level: number): FileNode[] {
    return Object.keys(obj).reduce<FileNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new FileNode();
      node.filename = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.type = value;
        }
      }
      return accumulator.concat(node);
    }, []);
  }

  showFormated(){

  this.stringfyJson(2);
  }

  stringfyJson(space){

try{
  this.jsonString = JSON.stringify(JSON.parse(this.jsonString), undefined, space);
   }catch(error){
  this.handleError(error); 
   }
  
  }

  showUnformated(){
   this.stringfyJson(0);
  }
  
  showTree(){
  
try{
   const dataObject = JSON.parse(this.jsonString);
 

    // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
    //     file node as children.
    const data = this.buildFileTree(dataObject, 0);
  this.nestedDataSource.data = data

 } catch(error){
  this.handleError(error);
  }
  }
 
 onKey(event: any,textarea) { // without type info
 
 var key = String.fromCharCode(event.keyCode)

 for(let tag of this.jsonTags){
    if(tag.openTag.includes(event.key)){
        textarea.value = textarea.value.slice(0,textarea.selectionStart) + tag.endTag + textarea.value.slice(textarea.selectionStart);
       textarea.setSelectionStart =textarea.selectionStart;
    }


  }
 }

 importFile(event) {

if (event.target.files.length == 0) {
   console.log("No file selected!");
   return
}
  let file: File = event.target.files[0];
  // after here 'file' can be accessed and used for further process
 var myReader:FileReader = new FileReader();
 var me = this;
    myReader.onloadend = function(e){
      // you can perform an action with readed data here
     console.log(this.result);
      me.jsonString = this.result.toString();
    }

    myReader.readAsText(file);
}

saveFile(){
  
     
  var blob = new Blob([this.jsonString], {type: 'text/plain'});
      var anchor = document.createElement('a');

anchor.download = "myJson.json";
anchor.href = (window.URL).createObjectURL(blob);
anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
anchor.click();

}

handleError(error) {
   let errorMessage = '';
   if (error.error instanceof ErrorEvent) {
     // client-side error
     errorMessage = `Error: ${error.error.message}`;
   } else {
     // server-side error
     errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
   }
   window.alert(errorMessage);
   //return throwError(errorMessage);
 }

 }