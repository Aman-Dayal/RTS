import logging

def setup_logger():
    """
    Set up the logger for the application.
    """
    logger = logging.getLogger("app_logger")
    logger.setLevel(logging.DEBUG)
    
    # Create console handler
    ch = logging.StreamHandler()
    ch.setLevel(logging.DEBUG)
    
    # Create formatter
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    ch.setFormatter(formatter)
    
    # Add handler to the logger
    logger.addHandler(ch)
    
    return logger

logger = setup_logger()
