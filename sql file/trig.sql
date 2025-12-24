DELIMITER $$

CREATE PROCEDURE sp_SearchByAccount(
    IN p_AccountNum VARCHAR(20),
    IN p_RelatedAccount VARCHAR(20),
    IN p_StartDate DATETIME,
    IN p_EndDate DATETIME,
    IN p_MinMoney DECIMAL(15,0),
    IN p_MaxMoney DECIMAL(15,0),
    IN p_IncludeSend BOOLEAN,
    IN p_IncludeReceive BOOLEAN
)
BEGIN
    -- Lấy thông tin khách hàng
    SELECT c.*, n.NationName, b.BankName 
    FROM ClientInfo c
    JOIN Nation n ON c.NationalityCode = n.NationalityCode
    JOIN Bank b ON c.BankCode = b.BankCode
    WHERE c.AccountNumber = p_AccountNum;

    -- Lấy danh sách giao dịch
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

DELIMITER ;



DELIMITER $$

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

DELIMITER ;