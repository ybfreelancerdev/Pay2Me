CREATE TABLE [dbo].[UserLocationlogs] (
    [Id]            INT           IDENTITY (1, 1) NOT NULL,
    [UserId]        INT           NOT NULL,
    [TransactionId] VARCHAR (15)  NOT NULL,
    [Latitude]      VARCHAR (50)  NULL,
    [Longitude]     VARCHAR (50)  NULL,
    [IpAddress]     VARCHAR (MAX) NOT NULL,
    CONSTRAINT [PK_UserLocationlogs] PRIMARY KEY CLUSTERED ([Id] ASC)
);

