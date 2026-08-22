CREATE TABLE [dbo].[Users] (
    [Id]                     INT           IDENTITY (1, 1) NOT NULL,
    [RoleId]                 INT           NOT NULL,
    [Username]               VARCHAR (50)  NOT NULL,
    [Password]               VARCHAR (MAX) NOT NULL,
    [Balance]                MONEY         NULL,
    [IsMerchant]             BIT           NULL,
    [WebsiteURL]             VARCHAR (MAX) NULL,
    [PartyOwner]             INT           NULL,
    [Limit]                  VARCHAR (500) NULL,
    [CreatedDate]            DATETIME      NOT NULL,
    [AuthenticatorEnable]    BIT           NULL,
    [AuthenticatorSecretKey] VARCHAR (100) NULL,
    [IsDelete]               BIT           NOT NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC)
);

