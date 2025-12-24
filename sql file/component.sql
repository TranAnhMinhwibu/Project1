create table Nation(
    NationalityCode     VARCHAR(5)      NOT NULL PRIMARY KEY,
    NationName          VARCHAR(255)    NOT NULL
);

create table Bank(
    BankCode            VARCHAR(20)     NOT NULL PRIMARY KEY,
    BankName            VARCHAR(255)    NOT NULL
);

create table ClientInfo(
    AccountNumber       VARCHAR(20)     NOT NULL PRIMARY KEY,
    SocialNumber        VARCHAR(20)             NOT Null UNIQUE,
    ClientName          VARCHAR(100)    NOT NULL,
    DateBirth           DATE            NOT NULL,
    NationalityCode     varCHAR(5)      NOT NULL,
    PhoneNumber         VARCHAR(15)     NOT NULL,
    Email               VARCHAR(100)    not NULL,
    ClientAddress       VARCHAR(255)    NOT NULL,
    BankCode            VARCHAR(20)     NOT NULL,
    Balance             DECIMAL(15, 0)  NOT NULL,
    CONSTRAINT FK_ClientInfo_Bank FOREIGN KEY (BankCode) REFERENCES Bank(BankCode),
    CONSTRAINT FK_ClientInfo_Nation FOREIGN KEY (NationalityCode) REFERENCES Nation(NationalityCode)
);

create table TransactionInfo(
    TransactionNumber   VARCHAR(20)     NOT NULL PRIMARY KEY,
    SendBankNum         VARCHAR(20)     NOT NULL,
    SendNumber          VARCHAR(20)     NOT NULL,
    ReceiveBankNum      VARCHAR(20)     NOT NULL,
    ReceiveNumber       VARCHAR(20)     NOT NULL,
    MoneySend           DECIMAL(15, 0)  NOT NULL,
    TimeSend            DATETIME        not null,
    Note                VARCHAR(255),
    CONSTRAINT FK_Bank_Send FOREIGN KEY (SendBankNum) REFERENCES Bank(BankCode),
    CONSTRAINT FK_Bank_Receive FOREIGN KEY (ReceiveBankNum) REFERENCES Bank(BankCode),
    CONSTRAINT FK_Client_Send FOREIGN KEY (SendNumber) REFERENCES ClientInfo(AccountNumber),
    CONSTRAINT FK_Client_Receive FOREIGN KEY (ReceiveNumber) REFERENCES ClientInfo(AccountNumber)
);

DELIMITER $$

CREATE TRIGGER trg_CheckBalance_BeforeInsert
BEFORE INSERT ON TransactionInfo
FOR EACH ROW
BEGIN
    DECLARE currentBal DECIMAL(15,0);
    SELECT Balance INTO currentBal FROM ClientInfo WHERE AccountNumber = NEW.SendNumber;
    
    IF currentBal < NEW.MoneySend THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Số dư không đủ để thực hiện giao dịch';
    END IF;
END$$

CREATE TRIGGER trg_UpdateBalance_AfterInsert
AFTER INSERT ON TransactionInfo
FOR EACH ROW
BEGIN
    UPDATE ClientInfo 
    SET Balance = Balance - NEW.MoneySend 
    WHERE AccountNumber = NEW.SendNumber;
    UPDATE ClientInfo 
    SET Balance = Balance + NEW.MoneySend 
    WHERE AccountNumber = NEW.ReceiveNumber;
END$$

CREATE PROCEDURE sp_SearchByAccount(
    IN p_AccountNum VARCHAR(20),
    IN p_RelatedAccount VARCHAR(20),
    IN p_EndDate DATETIME,
    IN p_MinMoney DECIMAL(15,0),
    IN p_MaxMoney DECIMAL(15,0),
    IN p_IncludeSend BOOLEAN,
    IN p_IncludeReceive BOOLEAN
)
BEGIN
    SELECT c.*, n.NationName, b.BankName 
    FROM ClientInfo c
    JOIN Nation n ON c.NationalityCode = n.NationalityCode
    JOIN Bank b ON c.BankCode = b.BankCode
    WHERE c.AccountNumber = p_AccountNum;
    SELECT t.*, 
           b1.BankName as SendBankName, 
           b2.BankName as ReceiveBankName
    FROM TransactionInfo t
    JOIN Bank b1 ON t.SendBankNum = b1.BankCode
    JOIN Bank b2 ON t.ReceiveBankNum = b2.BankCode
    WHERE 
        (
            (p_IncludeSend = TRUE AND t.SendNumber = p_AccountNum) 
            OR 
            (p_IncludeReceive = TRUE AND t.ReceiveNumber = p_AccountNum)
        )
        AND (p_RelatedAccount IS NULL OR p_RelatedAccount = '' OR t.SendNumber = p_RelatedAccount OR t.ReceiveNumber = p_RelatedAccount)
        AND (p_StartDate IS NULL OR t.TimeSend >= p_StartDate)
        AND (p_EndDate IS NULL OR t.TimeSend <= p_EndDate)
        AND (p_MinMoney IS NULL OR p_MinMoney = '' OR t.MoneySend >= p_MinMoney)
        AND (p_MaxMoney IS NULL OR p_MaxMoney = '' OR t.MoneySend <= p_MaxMoney)
    ORDER BY t.TimeSend DESC;
END$$

CREATE PROCEDURE sp_SearchBySocialID(
    IN p_SocialNum VARCHAR(20),
    IN p_RelatedAccount VARCHAR(20),
    IN p_StartDate DATETIME,
    IN p_EndDate DATETIME,
    IN p_MinMoney DECIMAL(15,0),
    IN p_MaxMoney DECIMAL(15,0),
    IN p_IncludeSend BOOLEAN,
    IN p_IncludeReceive BOOLEAN
)
BEGIN
    DECLARE v_AccountNum VARCHAR(20);
    SELECT AccountNumber INTO v_AccountNum FROM ClientInfo WHERE SocialNumber = p_SocialNum LIMIT 1;
    IF v_AccountNum IS NOT NULL THEN
        CALL sp_SearchByAccount(v_AccountNum, p_RelatedAccount, p_StartDate, p_EndDate, p_MinMoney, p_MaxMoney, p_IncludeSend, p_IncludeReceive);
    END IF;
END$$

CREATE PROCEDURE sp_SearchByTransactionID(
    IN p_TransID VARCHAR(20)
)
BEGIN
    SELECT t.*, 
           b1.BankName as SendBankName, 
           b2.BankName as ReceiveBankName
    FROM TransactionInfo t
    JOIN Bank b1 ON t.SendBankNum = b1.BankCode
    JOIN Bank b2 ON t.ReceiveBankNum = b2.BankCode
    WHERE t.TransactionNumber = p_TransID;
END$$

DELIMITER ;

