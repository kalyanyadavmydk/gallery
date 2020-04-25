import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  private folder=[]
  
  private folderupdated=new Subject()
  private imagesupdated=new Subject()
  private images=[]
  constructor(private http:HttpClient,private form : FormBuilder) { }

addfolder(foldername){
  console.log(foldername)
    this.http.post<any>('http://localhost:3000/gallery/createfolder',{foldername:foldername}).subscribe((data)=>{
        console.log(data,1234)
        this.folder.push(data)
        this.folderupdated.next([...this.folder])
    })

}

getfolderupdated(){
  return this.folderupdated.asObservable()
}
getfolder(){
  this.http.get<any>('http://localhost:3000/gallery/getfolder').subscribe((data)=>{
 
    for(let i=0;i<data.length;i++){
     
      this.folder.push(data[i])
    }
    return this.folderupdated.next([...this.folder])
  })
}

deletefolder(id){
  this.http.delete<any>('http://localhost:3000/gallery/deletefolder'+id).subscribe((result)=>{
    const updated=this.folder.filter(folder=>folder._id!==id)
    this.folder=updated
    this.folderupdated.next([...this.folder])
    this.images=[]
    this.imagesupdated.next([...this.images])
  })
}

addimages(img,id){

  const formdata=new FormData();
  formdata.append('file',img);
  formdata.append('id',id)
  this.http.post<any>('http://localhost:3000/file',formdata).subscribe((data)=>{
    console.log(data.imagepath)
    this.images.push(data.imagepath)
    this.imagesupdated.next([...this.images])
});

}

displayimages(id){
  this.images=[]
  this.http.get<any>('http://localhost:3000/gallery/dispalyimages'+id).subscribe(data=>{
    for(let i=0;i<data.photopath.length;i++){this.images.push(data.photopath[i])}
    this.imagesupdated.next([...this.images])
  })
}

getimagesupdated(){
  //console.log("getimages")
  return this.imagesupdated.asObservable()
}

deleteimage(id,img){
  var params={id:id,img:img}
  this.http.delete<any>('http://localhost:3000/gallery/deleteimage',{params}).subscribe(data=>{
    this.images=this.images.filter(imagepath=>imagepath!==img)
    this.imagesupdated.next([...this.images])
    console.log(data)
  })
  
}

}