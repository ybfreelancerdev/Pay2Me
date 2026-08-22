CREATE TABLE [dbo].[PaymentStatus] (
    [Id]            INT          IDENTITY (1, 1) NOT NULL,
    [PaymentStatus] VARCHAR (50) NOT NULL,
    CONSTRAINT [PK_PaymentStatus] PRIMARY KEY CLUSTERED ([Id] ASC)
);

