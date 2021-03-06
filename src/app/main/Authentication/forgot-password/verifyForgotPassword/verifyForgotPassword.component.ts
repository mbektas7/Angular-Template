import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MirapiConfigService } from '@mirapi/services/config.service';
import { mirapiAnimations } from '@mirapi/animations';

import { AlertifyService } from 'app/shared/services/alertify.service';
import { Router } from '@angular/router';
import { verifyforgotpasswordservice } from './verifyforgotpassword.service';

@Component({
    selector   : 'verifyforgotpassword',
    templateUrl: './verifyforgotpassword.component.html',
    styleUrls  : ['./verifyforgotpassword.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations : mirapiAnimations
})
export class verifyforgotpasswordComponent implements OnInit, OnDestroy
{
    sifre;
    isSubmitClicked=false;
    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _mirapiConfigService: MirapiConfigService,
        private _verifyforgotpasswordService :verifyforgotpasswordservice,
        private alertiyfyService:AlertifyService,
        private router:Router
    )
    {
        // Configure the layout
        this._mirapiConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };

        this._unsubscribeAll = new Subject();
    }

   
    ngOnInit(): void
    {      
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }


    verifyforgotpassword() {
        this.isSubmitClicked = true;
        this._verifyforgotpasswordService.updatePassword(this.sifre)
        .subscribe((res) => {
            this.alertiyfyService.success('Şifre başarıyla değiştirildi');
            this.router.navigateByUrl('/auth/login');
        },
        err => {
            this.alertiyfyService.error('Hata: ' + err.error.message);
            this.isSubmitClicked = false;
        });
  }
}
