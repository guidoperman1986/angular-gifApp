import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchGifsResponse } from '../interface/gifs.interface';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class GifsService {
  private apiKey     : string = 'CIVIHihMzkLlcMAknpQjSrdcB6r9Vq9Z';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  private _historial : string[] = [];
  public resultados  : Gif[] = [];

  constructor(private http: HttpClient) { 
      this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
      this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
  }

  get historial() {
    return [...this._historial];
  }

  buscarGifs(query: string){
    query = query.trim().toLocaleLowerCase();

    if (!this._historial.includes(query) && query.trim().length > 0){
      this._historial.unshift(query);
      this._historial = this._historial.splice(0,10);

      localStorage.setItem('historial',JSON.stringify(this._historial));
    }

    const params = new HttpParams()
                  .set('api_key', this.apiKey)
                  .set('limit', '10')
                  .set('q', query)

    return this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`, {params})
                .pipe(
                  tap((resp)=> localStorage.setItem('resultados', JSON.stringify(resp.data)))
                )
                .subscribe((resp)=>{
                  this.resultados = resp.data;
                });
        


  }
}
