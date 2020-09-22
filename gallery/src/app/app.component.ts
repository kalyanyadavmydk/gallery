import { Component ,OnInit,OnDestroy} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgForm } from "@angular/forms";
import { GalleryService } from './gallery.service';
import { Subscription } from "rxjs";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit,OnDestroy {
  images;
  dataval;
  file
  selected=""
  folders
  show=true
  private foldersub:Subscription
  private imagesub:Subscription
  ngOnInit(): void {
    this.galleryservice.getfolder()
    this.foldersub=this.galleryservice.getfolderupdated().subscribe(data=>{
      this.folders=data
  })
   
  }

  constructor(private http:HttpClient , private form : FormBuilder,private galleryservice:GalleryService){}
  
createfolder(form:NgForm){
    if(form.invalid)
    return;
    this.galleryservice.addfolder(form.value.folder);
    (document.getElementById('foldername') as HTMLInputElement).value=""
    
  }

deletefolder(){
    this.show=true
    this.galleryservice.deletefolder(this.selected)
    this.selected=""
  }
  closefolder(){
    this.show=true
    this.selected=""
    this.images=null
  }

dispalyimages(id){
  this.show=false
  this.selected=id
  this.galleryservice.displayimages(this.selected)
  this.imagesub=this.galleryservice.getimagesupdated().subscribe(data=>{
    this.images=data
  })
 }


onfileselect(event){
    if(event.target.files.length>0)
    {
       var file=event.target.files;
      for(let img of file)
      {
        this.galleryservice.addimages(img,this.selected)}
      }
  }


deleteimage(imgpath){
    this.galleryservice.deleteimage(this.selected,imgpath)
  }



ngOnDestroy(){
  this.foldersub.unsubscribe()
  this.imagesub.unsubscribe()
}
}
