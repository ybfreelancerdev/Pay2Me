CREATE TABLE [dbo].[TransactionLogs] (
    [Id]                INT              IDENTITY (1, 1) NOT NULL,
    [TransactionId]     VARCHAR (15)     NOT NULL,
    [AccountId]         UNIQUEIDENTIFIER NULL,
    [UserId]            INT              NOT NULL,
    [BankName]          VARCHAR (50)     NOT NULL,
    [AccountNo]         VARCHAR (50)     NOT NULL,
    [AccountHolderName] VARCHAR (50)     NOT NULL,
    [IFSCCode]          VARCHAR (50)     NOT NULL,
    CONSTRAINT [PK_TransactionLogs] PRIMARY KEY CLUSTERED ([Id] ASC)
);

