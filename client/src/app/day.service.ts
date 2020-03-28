import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DayService {
  url = "http://localhost:8000/";

  constructor(private httpClient: HttpClient) { }

  get_all_days()
  {
    return this.httpClient.get(this.url+"get");
  }

  get_days_byId(id)
  {
    return this.httpClient.post(this.url+"get", { "day": id });
  }

  create_day(day, description, creationDate, uploadDate)
  {
    console.log({ day, creationDate, description, uploadDate });
    return this.httpClient.post(this.url+"new",
      {
        "day": day,
        "description": description,
        "creationDate": creationDate,
        "uploadDate": uploadDate
      }
    );
  }
}
