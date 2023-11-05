using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nest;
using GateWay.Data;

using GateWay.Extension;
using System.Text;
using System.Net;
using API.Models;
using API.Data;
using API.Dtos;

namespace GateWay.Controllers
{
    [ApiController]
    [Route("api/product")]
    public class ProductController : ControllerBase
    {
        private readonly IProductRepo _repository;
        private readonly IMapper _mapper;
        private readonly IElasticClient _client;
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _webhost;
        private readonly RabbitMQExtension _rabbitMQ = new RabbitMQExtension();
        private readonly ConvertExtension _convert;

        public ProductController(IProductRepo repository, IMapper mapper, IElasticClient client, IConfiguration configuration, IWebHostEnvironment webHostEnvironment)
        {
            _repository = repository;
            _mapper = mapper;
            _client = client;
            _configuration = configuration;
            _webhost = webHostEnvironment;
            _convert = new ConvertExtension(webHostEnvironment);
        }

        #region Search

        [HttpPost]
        [Route("search")]
        public async Task<ActionResult> SearchProduct(SearchDto searchDto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(searchDto.search))
                {
                    return BadRequest(new
                    {
                        code = HttpStatusCode.BadRequest,
                        message = "Please enter your search word"
                    });
                }

                string outputResult = await analysisWord(searchDto.search.ToLower());

                var result = await _client.SearchAsync<Product>(s => s
                    .Query(q => q
                        .Match(m => m
                            .Field(f => f.Description)
                            .Query(outputResult)
                            .Analyzer("whitespace")
                        )
                    )
                    .Size(1000)
                    .Highlight(h => h
                       .Fields(f => f.Field(p => p.Description))
                    )
                );

                var searchResults = new List<Product>();

                foreach (var hit in result.Hits)
                {
                    if ((hit.Source.isPrivate == true && hit.Source.UserId == searchDto.idUser) || (hit.Source.isPrivate == false))
                    {
                        var highlights = hit.Highlight.TryGetValue("description", out var highlightArray)
                    ? string.Join(" ... ", highlightArray)
                    : "";
                        var searchResult = new Product
                        {
                            Id = hit.Source.Id,
                            Name = hit.Source.Name,
                            Description = highlights.ToString().ToLower(),
                            isPrivate = hit.Source.isPrivate,
                            Path = hit.Source.Path,
                            CreatedAt = hit.Source.CreatedAt,
                            UpdatedAt = hit.Source.UpdatedAt,
                            UserId = hit.Source.UserId,
                            CategoryId = hit.Source.CategoryId,
                            comments = hit.Source.comments
                        };

                        searchResults.Add(searchResult);
                    }
                }

                return Ok(searchResults);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    code = HttpStatusCode.BadRequest,
                    message = ex.Message
                });
            }
        }


        public static async Task<string> analysisWord(string words)
        {
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    string url = "https://test4website.click/api/search";
                    // string url = "http://localhost:5001/api/search";
                    var payload = new { search = words };
                    string jsonPayload = Newtonsoft.Json.JsonConvert.SerializeObject(payload);

                    // Create the request content with JSON payload
                    var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                    // Send the POST request
                    HttpResponseMessage response = await client.PostAsync(url, content);

                    if (response.IsSuccessStatusCode)
                    {
                        // Read the response content as a string
                        string responseBody = await response.Content.ReadAsStringAsync();

                        // Do something with the response data
                        return responseBody;
                    }
                    else
                    {
                        // Handle unsuccessful response
                        Console.WriteLine("API request failed. Status code: " + response.StatusCode);
                    }
                }
                catch (Exception ex)
                {
                    // Handle any exceptions
                    Console.WriteLine("An error occurred: " + ex.Message);
                }
            }

            return string.Empty;
        }

        #endregion

        #region get product


        [HttpGet("category/{id:int}")]
        public ActionResult<IEnumerable<ProductReadDto>> GetAllProductByCategory(int id)
        {
            var products = _repository.GetAllProductsByCategoryId(id);
            return Ok(products);
        }

        [HttpGet]
        public ActionResult<IEnumerable<ProductReadDto>> GetAllProduct()
        {
            var products = _repository.GetAllProducts();
            return Ok(products);
        }

        [HttpGet("blacklist")]
        public ActionResult<IEnumerable<ProductReturn>> GetAllProductAndBlacklist()
        {
            var products = _repository.GetAllProductsBlacklist();
            return Ok(products);
        }


        [HttpGet("{id:int}", Name = "GetProductById")]
        public ActionResult<ProductReadDto> GetProductById(int id)
        {
            var product = _repository.GetProductById(id);
            if (product != null)
            {
                return Ok(product);
            }
            return NotFound();
        }

        [HttpGet("user/{userId:int}")]
        public ActionResult<ProductReadDto> GetProductByUserId(int userId)
        {
            var products = _repository.GetAllProductsByUser(userId);
            return Ok(products);
        }

        #endregion

        #region create

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ProductReadDto>> CreateProduct([FromForm] ProductCreateDto request)
        {
            var date = DateTime.Now.ToString("MMddyyHHmmss");
            var allowedTypes = new[] { "application/pdf", "application/msword" };
            string description_segment = await analysisWord(request.Description);
            var product = new Product
            {
                Name = request.Name!,
                Description = request.Description,
                UserId = request.UserId,
                CategoryId = request.CategoryId,
                isPrivate = request.isPrivate
            };
            if (request.File!.Length > 0)
            {
                var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "files", "" + date + "_" + request.File.FileName);
                var outdir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "files");
                using (var stream = System.IO.File.Create(path))
                {
                    await request.File.CopyToAsync(stream);
                }

                product.PathDownload = date + "_" + request.File.FileName;


                var fileExtension = Path.GetExtension(request.File.FileName)?.ToLower();
                if (fileExtension == ".docx" || fileExtension == ".doc" || fileExtension == ".xlsx" || fileExtension == ".xls" || fileExtension == ".pptx" || fileExtension == ".ppt")
                {
                    var pdfPath = Path.ChangeExtension(path, ".pdf");
                    _convert.ConvertToPDF(path, outdir);
                    product.Path = Path.GetFileName(pdfPath);
                }
                else
                {
                    product.Path = date + "_" + request.File.FileName;
                }
            }

            _repository.CreateDoc(product);
            _repository.SaveChanges();

            product.Description = description_segment;

            await _client.IndexDocumentAsync(product);

            var productRead = _mapper.Map<ProductReadDto>(product);
            return CreatedAtRoute(nameof(GetProductById), new { Id = productRead.Id }, productRead);
            // return Ok();
        }

        [HttpPost]
        [Authorize]
        [Route("mobile")]
        public async Task<ActionResult<ProductReadDto>> CreateProductMobile(ProductCreateBase64Dto request)
        {
            var date = DateTime.Now.ToString("MMddyyHHmmss");
            var allowedTypes = new[] { "application/pdf", "application/msword" };
            string description_segment = await analysisWord(request.Description);
            var product = new Product
            {
                Name = request.Name!,
                Description = request.Description,
                UserId = request.UserId,
                CategoryId = request.CategoryId,
                isPrivate = request.isPrivate
            };
            if (request.base64String?.Length > 0)
            {
                byte[] fileBytes = Convert.FromBase64String(request.base64String);
                var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "files", "" + date + "_" + request.NameFile);
                var outdir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "files");
                using (FileStream fileStream = new FileStream(path, FileMode.Create))
                {
                    fileStream.Write(fileBytes, 0, fileBytes.Length);
                }
                product.PathDownload = date + "_" + request.NameFile;

                var fileExtension = Path.GetExtension(path)?.ToLower();
                if (fileExtension == ".docx" || fileExtension == ".doc" || fileExtension == ".xlsx" || fileExtension == ".xls" || fileExtension == ".pptx" || fileExtension == ".ppt")
                {
                    var pdfPath = Path.ChangeExtension(path, ".pdf");
                    _convert.ConvertToPDF(path, outdir);
                    product.Path = Path.GetFileName(pdfPath);
                }
                else
                {
                    product.Path = date + "_" + request.NameFile;
                }
            }


            _repository.CreateDoc(product);
            _repository.SaveChanges();

            product.Description = description_segment;

            await _client.IndexDocumentAsync(product);

            var productRead = _mapper.Map<ProductReadDto>(product);
            return CreatedAtRoute(nameof(GetProductById), new { id = productRead.Id }, productRead);
        }

        #endregion

        #region update

        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<ActionResult<ProductReadDto>> UpdateProduct([FromForm] ProductCreateDto request, int id)
        {
            try
            {

                var date = DateTime.Now.ToString("MMddyyHHmmss");
                var product = _repository.GetProductById(id);
                if (product == null)
                {
                    return NotFound();
                }
                string description_segment = await analysisWord(request.Description);
                product.Name = request.Name!;
                product.Description = request.Description!;
                product.UpdatedAt = DateTimeOffset.Now;
                product.isPrivate = request.isPrivate;
                product.CategoryId = request.CategoryId;
                if (request?.File?.Length > 0)
                {
                    var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "files", "" + date + "_" + request.File.FileName);
                    var outdir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "files");
                    using (var stream = System.IO.File.Create(path))
                    {
                        await request.File.CopyToAsync(stream);
                    }

                    product.PathDownload = date + "_" + request.File.FileName;

                    var fileExtension = Path.GetExtension(request.File.FileName)?.ToLower();
                    if (fileExtension == ".docx" || fileExtension == ".doc" || fileExtension == ".xlsx" || fileExtension == ".xls" || fileExtension == ".pptx" || fileExtension == ".ppt")
                    {
                        var pdfPath = Path.ChangeExtension(path, ".pdf");
                        _convert.ConvertToPDF(path, outdir);
                        product.Path = Path.GetFileName(pdfPath);
                    }
                    else
                    {
                        product.Path = date + "_" + request.File.FileName;
                    }
                }

                _repository.SaveChanges();
                product.Description = description_segment;

                var updateResponse = await _client.UpdateAsync<Product>(product.Id, u => u
                    .Index(_configuration["ELKConfiguration:index"]!)
                    .Doc(product)
                );
                var productRead = _mapper.Map<ProductReadDto>(product);

                return CreatedAtRoute(nameof(GetProductById), new { Id = productRead.Id }, productRead);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        [HttpPut("mobile/{id:int}")]
        [Authorize]
        public async Task<ActionResult<ProductReadDto>> UpdateProductByMobile(ProductCreateBase64Dto request, int id)
        {
            try
            {
                var date = DateTime.Now.ToString("MMddyyHHmmss");
                var product = _repository.GetProductById(id);

                if (product == null)
                {
                    return NotFound();
                }
                string description_segment = await analysisWord(request.Description);
                product.Name = request.Name!;
                product.Description = request.Description!;
                product.UpdatedAt = DateTimeOffset.Now;
                product.isPrivate = request.isPrivate;
                product.CategoryId = request.CategoryId;

                if (request.base64String?.Length > 0)
                {
                    byte[] fileBytes = Convert.FromBase64String(request.base64String);
                    var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "files", "" + date + "_" + request.NameFile);
                    var outdir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "files");
                    using (FileStream fileStream = new FileStream(path, FileMode.Create))
                    {
                        fileStream.Write(fileBytes, 0, fileBytes.Length);
                    }

                    product.PathDownload = date + "_" + request.NameFile;

                    var fileExtension = Path.GetExtension(path)?.ToLower();
                    if (fileExtension == ".docx" || fileExtension == ".doc" || fileExtension == ".xlsx" || fileExtension == ".xls" || fileExtension == ".pptx" || fileExtension == ".ppt")
                    {
                        var pdfPath = Path.ChangeExtension(path, ".pdf");
                        _convert.ConvertToPDF(path, outdir);
                        product.Path = Path.GetFileName(pdfPath);
                    }
                    else
                    {
                        product.Path = date + "_" + request.NameFile;
                    }

                }

                _repository.SaveChanges();

                product.Description = description_segment;

                await _client.UpdateAsync<Product>(product.Id, u => u
                    .Index(_configuration["ELKConfiguration:index"]!)
                    .Doc(product)
                );

                var productRead = _mapper.Map<ProductReadDto>(product);

                return CreatedAtRoute(nameof(GetProductById), new { Id = productRead.Id }, productRead);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        #endregion

        #region delete

        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = _repository.GetProductById(id);
            if (product == null)
            {
                return NotFound();
            }

            _repository.DeleteDoc(product);
            _repository.SaveChanges();
            await _client.DeleteAsync<Product>(id);
            return Ok();
        }

        #endregion

        #region download

        [HttpGet("download/{id:int}")]
        public ActionResult DownloadFile(int id)
        {
            var product = _repository.GetProductById(id);
            if (product == null)
            {
                return NotFound();
            }

            string filePath = Path.Combine(_webhost.WebRootPath, "files", product.PathDownload);

            // Check if the file exists
            if (!System.IO.File.Exists(filePath))
                return NotFound();

            // Stream the file to the client using FileStreamResult
            var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read);
            return new FileStreamResult(fileStream, "application/octet-stream")
            {
                FileDownloadName = Path.GetFileName(filePath)
            };
        }

        #endregion
    }
}
