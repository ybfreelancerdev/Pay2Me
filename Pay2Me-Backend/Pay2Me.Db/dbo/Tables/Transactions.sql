CREATE TABLE [dbo].[Transactions] (
    [Id]                    INT           IDENTITY (1, 1) NOT NULL,
    [TTypeId]               INT           NOT NULL,
    [TransactionId]         VARCHAR (15)  NOT NULL,
    [ReferenceId]           VARCHAR (6)   NULL,
    [UserId]                INT           NOT NULL,
    [PaymentStatusId]       INT           NULL,
    [TransactionStatuId]    INT           NOT NULL,
    [CAmount]               MONEY         NOT NULL,
    [DAmount]               MONEY         NOT NULL,
    [Closing]               MONEY         NOT NULL,
    [Remarks]               VARCHAR (MAX) CONSTRAINT [DF_Transactions_Remarks] DEFAULT ('') NULL,
    [CreatedDate]           DATETIME      NOT NULL,
    [RequestRead]           BIT           CONSTRAINT [DF_Transactions_RequestRead] DEFAULT ((0)) NULL,
    [Descriptions]          VARCHAR (MAX) CONSTRAINT [DF_Transactions_Descriptions] DEFAULT ('') NULL,
    [AssignParty]           INT           CONSTRAINT [DF_Transactions_AssignParty] DEFAULT ((0)) NULL,
    [IsUserCommissionEntry] BIT           CONSTRAINT [DF_Transactions_IsUserCommissionEntry] DEFAULT ((0)) NULL,
    [IsDeleted]             BIT           CONSTRAINT [DF_Transactions_IsDeleted] DEFAULT ((0)) NULL,
    [DeletedDate]           DATETIME      NULL,
    [IsSettle]              BIT           CONSTRAINT [DF_Transactions_IsSettle] DEFAULT ((0)) NULL,
    CONSTRAINT [PK_Transactions] PRIMARY KEY CLUSTERED ([Id] ASC)
);

