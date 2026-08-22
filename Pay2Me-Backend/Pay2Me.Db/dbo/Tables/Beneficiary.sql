CREATE TABLE [dbo].[Beneficiary] (
    [Id]                INT              IDENTITY (1, 1) NOT NULL,
    [AccountId]         UNIQUEIDENTIFIER NOT NULL,
    [UserId]            INT              NOT NULL,
    [BankName]          VARCHAR (50)     NOT NULL,
    [AccountNo]         VARCHAR (50)     NOT NULL,
    [AccountHolderName] VARCHAR (50)     NOT NULL,
    [IFSCCode]          VARCHAR (50)     NOT NULL,
    [CreatedDate]       DATETIME         NOT NULL,
    [IsDeleted]         BIT              NOT NULL,
    CONSTRAINT [PK_Beneficiary] PRIMARY KEY CLUSTERED ([Id] ASC)
);

