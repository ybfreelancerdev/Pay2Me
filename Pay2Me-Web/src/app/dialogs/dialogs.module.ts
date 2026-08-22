import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { ComponentsModule } from '../components/components.module';
import { AuthenticatorComponent } from './authenticator/authenticator.component';
import { MatIconModule } from '@angular/material/icon';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AddBalanceComponent } from './add-balance/add-balance.component';
import { AddWithdrawComponent } from './add-withdraw/add-withdraw.component';
import { NotificationMessageComponent } from './notification-message/notification-message.component';
import { AmountSettingComponent } from './amount-setting/amount-setting.component';
import { TransactionDetailComponent } from './transaction-detail/transaction-detail.component';
import { PremiumAdsComponent } from './premium-ads/premium-ads.component';
import { ShowAdsComponent } from './show-ads/show-ads.component';
import { AddPartyComponent } from './add-party/add-party.component';
import { UserLimitComponent } from './user-limit/user-limit.component';

@NgModule({
  declarations: [
    AuthenticatorComponent,
    ChangePasswordComponent,
    AddUserComponent,
    AddBalanceComponent,
    AddWithdrawComponent,
    NotificationMessageComponent,
    AmountSettingComponent,
    TransactionDetailComponent,
    PremiumAdsComponent,
    ShowAdsComponent,
    AddPartyComponent,
    UserLimitComponent
  ],
  imports: [
    MatToolbarModule,
    MatDatepickerModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatMenuModule,
    ComponentsModule,
    MatDatepickerModule,
    MatIconModule
  ],
  exports: [
    AuthenticatorComponent,
    ChangePasswordComponent,
    AddUserComponent,
    AddBalanceComponent,
    AddWithdrawComponent,
    NotificationMessageComponent,
    AmountSettingComponent,
    TransactionDetailComponent,
    PremiumAdsComponent,
    ShowAdsComponent
  ]
})
export class DialogsModule { }
