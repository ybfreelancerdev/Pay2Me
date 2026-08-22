CREATE TABLE [dbo].[PartyCommission] (
    [Id]         INT            IDENTITY (1, 1) NOT NULL,
    [UserId]     INT            NOT NULL,
    [PartyId]    INT            NOT NULL,
    [Commission] DECIMAL (4, 2) NOT NULL,
    CONSTRAINT [PK_PartyCommission] PRIMARY KEY CLUSTERED ([Id] ASC)
);

