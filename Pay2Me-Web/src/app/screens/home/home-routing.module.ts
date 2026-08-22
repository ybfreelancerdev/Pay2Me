import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortalAuthGuardService } from 'src/app/services/portal-auth-guard.service';
import { HomeComponent } from './home.component';

const routes: Routes = [
    {
        path: '', component: HomeComponent, canActivateChild: [PortalAuthGuardService],
        children: [
            { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(d => d.DashboardModule)},
            { path: 'beneficiary', loadChildren: () => import('./beneficiary/beneficiary.module').then(d => d.BeneficiaryModule) },
            { path: 'send-money', loadChildren: () => import('./send-money/send-money.module').then(d => d.SendMoneyModule) },
            { path: 'transfer-receipt', loadChildren: () => import('./transfer-receipt/transfer-receipt.module').then(d => d.TransferReceiptModule) },
            { path: 'transactions', loadChildren: () => import('./transactions/transactions.module').then(d => d.TransactionsModule) },
            { path: 'transactions/:value', loadChildren: () => import('./transactions/transactions.module').then(d => d.TransactionsModule) },
            { path: 'users', loadChildren: () => import('./users/users.module').then(d => d.UsersModule) },
            { path: 'all-requests', loadChildren: () => import('./all-requests/all-requests.module').then(d => d.AllRequestsModule) },
            { path: 'reports', loadChildren: () => import('./reports/reports.module').then(d => d.ReportsModule) },
            { path: 'parties', loadChildren: () => import('./parties/parties.module').then(d => d.PartiesModule) },
            { path: 'inprocess-requests', loadChildren: () => import('./inprocess-request/inprocess-request.module').then(d => d.InprocessRequestModule) },
            { path: 'hawala-entry', loadChildren: () => import('./hawala-entry/hawala-entry.module').then(d => d.HawalaEntryModule) },
            { path: 'hawala-logs', loadChildren: () => import('./hawala-logs/hawala-logs.module').then(d => d.HawalaLogsModule) },
            { path: 'hawala-transactions', loadChildren: () => import('./hawala-transactions/hawala-transactions.module').then(d => d.HawalaTransactionsModule) },
            { path: 'hawala-transactions/:value', loadChildren: () => import('./hawala-transactions/hawala-transactions.module').then(d => d.HawalaTransactionsModule) },
            { path: 'general-reports', loadChildren: () => import('./general-reports/general-reports.module').then(d => d.GeneralReportsModule) },
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
