CREATE TABLE [dbo].[TransactionStatus] (
    [Id]                INT          IDENTITY (1, 1) NOT NULL,
    [TransactionStatus] VARCHAR (50) NOT NULL,
    CONSTRAINT [PK_TransactionStatus] PRIMARY KEY CLUSTERED ([Id] ASC)
);

