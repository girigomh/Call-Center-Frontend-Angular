import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, Globals } from 'app/shared/global/globals';
import { Observable, Subject, map, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class CompanyService {


  globals = new Globals()
  bakendBaseUri = this.globals.authUri;
  allCompaniesData$ = new Observable<any>()
  header = new HttpHeaders().set('Authorization', 'Bearer '+localStorage.getItem('currentToken'))
  
  constructor(private http: HttpClient) { }

  getAllCompanies(){
    return this.http.get(`${this.bakendBaseUri}/companies`, {headers : this.header}).pipe(
      tap((companiesData:any) => companiesData.data),
      map((companiesData: any) => {
        companiesData = companiesData.data.map((company) => {
          return {...company, profile: {name: "company", description: "Company page"}}
        })
        console.log(companiesData)
        return companiesData
      }),
      tap((companiesData: any) => this.allCompaniesData$ = of(companiesData)),
    )
  }

  
  public get allCompanies() : Observable<any> {
    return this.allCompaniesData$
  }
  

  getCompanyByName(name: string): Observable<any>{
    return this.allCompanies.pipe(
      map((companies) => companies.filter((company) => company.name.toLowerCase() === name.toLowerCase())),
      // switchMap((findComapny)=> this.getCompanyById(findComapny.userId))
    )
  }

  getCompanyById(companyId){
    return this.http.get(`${this.bakendBaseUri}/companies/${companyId}`, {headers : this.header})
  }

  getAllCategories() {
    return this.http.get(`${this.bakendBaseUri}/companies/categories`, {headers : this.header}).pipe(
    map((categories:any) => categories.data)
    )
  }

  createCategory(payload){
    return this.http.post(`${this.bakendBaseUri}/companies/categories`, payload, { headers : this.header})
  }

  createCompany(payload:CompanyPayload){
    return this.http.post(`${this.bakendBaseUri}/companies`, payload, {headers: this.header})
  }
  
}
export interface CompanyPayload{
  companyCategoryId: number;
  name: string;
  email: string;
  websiteUrl: string;
  videoCallUrl: string;
  description: string;
  openHours: string;
  type: string;
  videoCallEmployee: string;
  videoCallLeader: string;
}